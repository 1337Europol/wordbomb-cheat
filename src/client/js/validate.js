import { QUERY_MAX_LENGTH } from './constants.js';

const RE_QUERY = /^[\p{L}'\-]*$/u;

/**
 *
 * @param {string}
 * @returns {string}
 */
export function sanitizeQuery(raw) {
    return raw
        .toLowerCase()
        .replace(/[^\p{L}'\-]/gu, '')
        .slice(0, QUERY_MAX_LENGTH);
}

/**
 * @param {string}
 * @returns {boolean}
 */
export function isQueryValid(query) {
    return query.length >= 2 && RE_QUERY.test(query);
}
