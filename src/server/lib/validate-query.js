'use strict';

const { SEARCH } = require('../config');

const RE_QUERY = /^[\p{L}'\-]+$/u;
const RE_FILTERS = /^[\w,]*$/;
const MAX_FILTERS_LENGTH = 64;

/**
 * @param {string} raw
 * @returns {{ valid: true, value: string } | { valid: false, error: string }}
 */
function validateSearchQuery(raw) {
    if (typeof raw !== 'string') {
        return { valid: false, error: 'Paramètre q invalide' };
    }

    const value = raw.trim().toLowerCase();

    if (!value) {
        return { valid: false, error: 'Requête vide' };
    }

    if (value.length < SEARCH.MIN_QUERY_LENGTH) {
        return { valid: false, error: `Minimum ${SEARCH.MIN_QUERY_LENGTH} caractères` };
    }

    if (value.length > SEARCH.MAX_QUERY_LENGTH) {
        return { valid: false, error: `Maximum ${SEARCH.MAX_QUERY_LENGTH} caractères` };
    }

    if (!RE_QUERY.test(value)) {
        return { valid: false, error: 'Caractères non autorisés' };
    }

    return { valid: true, value };
}

/**
 * @param {unknown} raw
 * @returns {string}
 */
function sanitizeFilters(raw) {
    const value = String(raw || '');

    if (value.length > MAX_FILTERS_LENGTH || !RE_FILTERS.test(value)) {
        return '';
    }

    return value;
}

module.exports = { validateSearchQuery, sanitizeFilters };
