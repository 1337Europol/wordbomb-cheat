'use strict';

const path = require('path');

const SERVER_DIR = path.join(__dirname, '..');
const SRC_DIR = path.join(SERVER_DIR, '..');
const DATA_DIR = path.join(SRC_DIR, 'data');
const CLIENT_DIR = path.join(SRC_DIR, 'client');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    PORT: parseInt(process.env.PORT, 10) || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    isProduction,
    TRUST_PROXY: process.env.TRUST_PROXY === 'true' || isProduction,
    DICT_PATH: path.join(DATA_DIR, 'words.json'),
    CURATED_PATH: path.join(DATA_DIR, 'curated-hyphen.json'),
    CLIENT_DIR,
    SEARCH: {
        DEFAULT_LIMIT: 300,
        MAX_LIMIT: 2000,
        LONG_WORD_MIN: 8,
        MIN_QUERY_LENGTH: 2,
        MAX_QUERY_LENGTH: 32,
    },
    RATE_LIMIT: {
        WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 60_000,
        MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX, 10) || 120,
    },
    CONTACT: {
        WINDOW_MS: parseInt(process.env.CONTACT_WINDOW_MS, 10) || 3_600_000,
        MAX_PER_WINDOW: parseInt(process.env.CONTACT_MAX_PER_HOUR, 10) || 5,
        LOG_PATH: path.join(DATA_DIR, 'contact-log.json'),
        LOG_RETENTION_MS: parseInt(process.env.CONTACT_LOG_RETENTION_MS, 10) || 30 * 24 * 60 * 60 * 1000,
        LOG_MAX_ENTRIES: parseInt(process.env.CONTACT_LOG_MAX_ENTRIES, 10) || 5000,
    },
};
