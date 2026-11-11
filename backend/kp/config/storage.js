const fs = require('fs');
const path = require('path');

const isR2Configured = () => {
    return Boolean(
        process.env.R2_ACCOUNT_ID &&
        process.env.R2_ACCESS_KEY_ID &&
        process.env.R2_SECRET_ACCESS_KEY &&
        process.env.R2_BUCKET_NAME
    );
};

let s3Client = null;

function getS3Client() {
    if (!s3Client && isR2Configured()) {
        const { S3Client } = require('@aws-sdk/client-s3');
        s3Client = new S3Client({
            region: 'auto',
            endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID,
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
            }
        });
    }
    return s3Client;
}

/**
 * Upload buffer atau file stream ke storage (Cloudflare R2 atau fallback lokal).
 * @param {Buffer|ReadableStream} fileContent Buffer atau stream file
 * @param {string} destinationKey Nama file / path di bucket (contoh: document-sertif/sertif_1.pdf)
 * @param {string} contentType MIME type file
 * @returns {Promise<{ url: string, key: string, storage: 'r2'|'local' }>}
 */
async function uploadFile(fileContent, destinationKey, contentType = 'application/octet-stream') {
    if (isR2Configured()) {
        const { PutObjectCommand } = require('@aws-sdk/client-s3');
        const client = getS3Client();

        await client.send(new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: destinationKey,
            Body: fileContent,
            ContentType: contentType
        }));

        const publicDomain = process.env.R2_PUBLIC_DOMAIN
            ? process.env.R2_PUBLIC_DOMAIN.replace(/\/$/, '')
            : `https://${process.env.R2_BUCKET_NAME}.${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

        return {
            url: `${publicDomain}/${destinationKey}`,
            key: destinationKey,
            storage: 'r2'
        };
    }

    // Fallback: Penyimpanan lokal di folder public/
    const localPath = path.resolve(__dirname, '../public', destinationKey);
    const dir = path.dirname(localPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(localPath, fileContent);

    return {
        url: `/static/${destinationKey.replace(/\\/g, '/')}`,
        key: destinationKey,
        storage: 'local'
    };
}

/**
 * Hapus file dari Cloudflare R2 atau disk lokal.
 * @param {string} destinationKey Nama file / key
 */
async function deleteFile(destinationKey) {
    if (!destinationKey) return;

    if (isR2Configured()) {
        try {
            const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
            const client = getS3Client();
            await client.send(new DeleteObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME,
                Key: destinationKey
            }));
        } catch (err) {
            console.error(`Gagal menghapus file R2 [${destinationKey}]:`, err.message);
        }
        return;
    }

    // Fallback lokal
    const localPath = path.resolve(__dirname, '../public', destinationKey);
    if (fs.existsSync(localPath)) {
        try {
            fs.unlinkSync(localPath);
        } catch (err) {
            console.error(`Gagal menghapus file lokal [${localPath}]:`, err.message);
        }
    }
}

module.exports = {
    isR2Configured,
    uploadFile,
    deleteFile
};
