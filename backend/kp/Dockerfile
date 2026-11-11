# Multi-stage / Production Dockerfile untuk Backend MAPTA (Express + Puppeteer Chromium)
FROM node:20-bookworm-slim

# Pasang dependensi Chromium native & font agar Puppeteer berjalan tanpa crash di Linux
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    fonts-ipafont-gothic \
    fonts-wqy-zenhei \
    fonts-thai-tlwg \
    fonts-kacst \
    fonts-freefont-ttf \
    libxss1 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Konfigurasi Puppeteer untuk menggunakan Chromium sistem Linux
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    NODE_ENV=production \
    PORT=3001

WORKDIR /app

# Salin package manifest terlebih dahulu untuk caching layer Docker
COPY package*.json ./

# Pasang dependensi produksi
RUN npm ci --omit=dev

# Salin seluruh kode backend
COPY . .

# Buat folder penampung file publik jika belum ada
RUN mkdir -p public/document-peserta public/document-sertif public/foto-peserta

EXPOSE 3001

# Healthcheck bawaan container
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 3001) + '/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1); }).on('error', () => process.exit(1));"

CMD ["node", "./bin/www"]
