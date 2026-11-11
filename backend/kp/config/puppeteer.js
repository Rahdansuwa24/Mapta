const puppeteer = require('puppeteer');

class TaskQueue {
    constructor(concurrency = 1) {
        this.concurrency = concurrency;
        this.running = 0;
        this.queue = [];
    }

    add(task) {
        return new Promise((resolve, reject) => {
            this.queue.push({ task, resolve, reject });
            this.next();
        });
    }

    async next() {
        if (this.running >= this.concurrency || this.queue.length === 0) {
            return;
        }

        this.running++;
        const { task, resolve, reject } = this.queue.shift();

        try {
            const result = await task();
            resolve(result);
        } catch (error) {
            reject(error);
        } finally {
            this.running--;
            this.next();
        }
    }
}

// Batasi konkurensi render PDF ke 1 proses bersamaan agar RAM VM tetap aman (<1.5GB)
const pdfQueue = new TaskQueue(1);

/**
 * Render HTML menjadi PDF buffer secara aman dengan antrian dan penutupan browser terjamin.
 * @param {string} html Konten HTML yang akan dirender
 * @param {object} options Opsi tambahan untuk page.pdf
 * @returns {Promise<Buffer>}
 */
async function renderPdfFromHtml(html, options = {}) {
    return pdfQueue.add(async () => {
        const launchOptions = {
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--no-first-run',
                '--no-zygote',
                '--single-process'
            ]
        };

        if (process.env.PUPPETEER_EXECUTABLE_PATH) {
            launchOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
        }

        const browser = await puppeteer.launch(launchOptions);
        try {
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: 'networkidle0', timeout: 45000 });
            const pdfBuffer = await page.pdf({
                format: options.format || 'A4',
                printBackground: options.printBackground !== false,
                ...options
            });
            return pdfBuffer;
        } finally {
            await browser.close();
        }
    });
}

module.exports = {
    renderPdfFromHtml,
    pdfQueue
};
