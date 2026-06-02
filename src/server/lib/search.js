'use strict';

const { normalizeText } = require('./normalize');
const { SEARCH } = require('../config');

const VALID_FILTERS = new Set(['plural', 'verbs', 'long', 'hyphen', 'simple']);
const VALID_SORT_MODES = new Set(['length', 'alpha']);

/**
 * @param {string} raw
 * @returns {Set<string>}
 */
function parseFilters(raw) {
    return new Set(
        String(raw || '')
            .split(',')
            .filter((f) => VALID_FILTERS.has(f))
    );
}

/**
 * @param {string} raw
 * @returns {'length' | 'alpha'}
 */
function parseSortMode(raw) {
    return VALID_SORT_MODES.has(raw) ? raw : 'length';
}

/**
 * @param {string} raw
 * @returns {number}
 */
function parseLimit(raw) {
    const limit = parseInt(raw, 10);
    if (Number.isNaN(limit) || limit <= 0) {
        return SEARCH.DEFAULT_LIMIT;
    }
    return Math.min(limit, SEARCH.MAX_LIMIT);
}

/**
 * @param {import('./dictionary').WordEntry} entry
 * @param {Set<string>} filters
 * @returns {boolean}
 */
function matchesFilters(entry, filters) {
    if (filters.has('plural') && !entry.plural) return false;
    if (filters.has('verbs') && !entry.verb) return false;
    if (filters.has('long') && entry.len < SEARCH.LONG_WORD_MIN) return false;
    if (filters.has('hyphen') && !entry.hyphen) return false;
    if (filters.has('simple') && !entry.simple) return false;
    return true;
}

/**
 * @param {import('./dictionary').WordEntry[]} entries
 * @param {'length' | 'alpha'} sort
 */
function sortEntries(entries, sort) {
    if (sort === 'alpha') {
        entries.sort((a, b) => a.word.localeCompare(b.word, 'fr'));
        return;
    }

    entries.sort((a, b) => {
        const lengthDiff = b.len - a.len;
        if (lengthDiff !== 0) return lengthDiff;
        if (a.plural !== b.plural) return a.plural ? -1 : 1;
        return a.word.localeCompare(b.word, 'fr');
    });
}

/**
 * @param {import('./dictionary').WordEntry[]} dictionary
 * @param {{ q: string, sort: string, filters: string, limit: string }} query
 * @returns {{ total: number, shown: number, words: import('./dictionary').WordEntry[] }}
 */
function searchDictionary(dictionary, query) {
    const q = query.q.trim().toLowerCase();

    if (!q) {
        return { total: 0, shown: 0, words: [] };
    }

    const qNorm = normalizeText(q);
    const sort = parseSortMode(query.sort);
    const filters = parseFilters(query.filters);
    const limit = parseLimit(query.limit);

    const matched = dictionary.filter(
        (entry) => entry.norm.includes(qNorm) && matchesFilters(entry, filters)
    );

    sortEntries(matched, sort);

    const words = matched.slice(0, limit);

    return {
        total: matched.length,
        shown: words.length,
        words,
    };
}

module.exports = { searchDictionary };
