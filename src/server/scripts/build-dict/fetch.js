'use strict';

const https = require('https');
const http = require('http');

const REQUEST_TIMEOUT_MS = 30_000;

/**
 * @param {string} url
 * @returns {Promise<Buffer>}
 */
function fetchBuffer(url) {
    return new Promise((resolve, reject) => {
        const mod = url.startsWith('https') ? https : http;
        const chunks = [];

        const req = mod.get(url, { timeout: REQUEST_TIMEOUT_MS }, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                fetchBuffer(res.headers.location).then(resolve).catch(reject);
                return;
            }

            if (res.statusCode !== 200) {
                reject(new Error(`HTTP ${res.statusCode} — ${url}`));
                return;
            }

            res.on('data', (chunk) => chunks.push(chunk));
            res.on('end', () => resolve(Buffer.concat(chunks)));
        });

        req.on('error', reject);
        req.on('timeout', () => {
            req.destroy();
            reject(new Error(`Timeout ${url}`));
        });
    });
}

module.exports = { fetchBuffer };
