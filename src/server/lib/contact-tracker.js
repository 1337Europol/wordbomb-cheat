'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { CONTACT } = require('../config');

/**
 * @returns {object[]}
 */
function readLog() {
    fs.mkdirSync(path.dirname(CONTACT.LOG_PATH), { recursive: true });

    if (!fs.existsSync(CONTACT.LOG_PATH)) {
        return [];
    }

    try {
        const data = JSON.parse(fs.readFileSync(CONTACT.LOG_PATH, 'utf8'));
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

/**
 * @param {object[]} entrees
 */
function writeLog(entries) {
    const cutoff = Date.now() - CONTACT.LOG_RETENTION_MS;
    const pruned = entries
        .filter((entry) => entry.ts > cutoff)
        .slice(-CONTACT.LOG_MAX_ENTRIES);

    fs.writeFileSync(CONTACT.LOG_PATH, JSON.stringify(pruned, null, 2), 'utf8');
}

/**
 * @param {import('express').Request} req
 * @returns {string}
 */
function getClientIp(req) {
    return req.ip || req.socket?.remoteAddress || 'unknown';
}

/**
 * @param {object[]} entrees
 * @param {string} champ
 * @param {string} valeur
 * @returns {number}
 */
function countInWindow(entries, field, value) {
    const since = Date.now() - CONTACT.WINDOW_MS;
    return entries.filter(
        (entry) => entry.ts >= since && entry[field] === value
    ).length;
}

/**
 * @param {string} ip
 * @param {string} clientId
 * @returns {{ allowed: boolean, reason?: string }}
 */
function checkContactRateLimit(ip, clientId) {
    const entries = readLog();
    const ipCount = countInWindow(entries, 'ip', ip);
    const clientCount = countInWindow(entries, 'clientId', clientId);

    if (ipCount >= CONTACT.MAX_PER_WINDOW) {
        return { allowed: false, reason: 'ip' };
    }

    if (clientCount >= CONTACT.MAX_PER_WINDOW) {
        return { allowed: false, reason: 'client' };
    }

    return { allowed: true };
}

/**
 * @param {{
 *   ip: string,
 *   clientId: string,
 *   userAgent: string,
 *   subject: string,
 *   email: string,
 * }} meta
 */
function logContactSubmission(meta) {
    const entries = readLog();

    entries.push({
        ts: Date.now(),
        ip: meta.ip,
        clientId: meta.clientId,
        userAgent: meta.userAgent.slice(0, 200),
        subject: meta.subject,
        emailHash: crypto
            .createHash('sha256')
            .update(meta.email)
            .digest('hex')
            .slice(0, 16),
    });

    writeLog(entries);
}

module.exports = {
    getClientIp,
    checkContactRateLimit,
    logContactSubmission,
};
