'use strict';

const RE_VALID = /^[\p{L}][\p{L}'\-]*[\p{L}']$|^[\p{L}]$/u;
const MIN_LENGTH = 2;
const MAX_LENGTH = 60;

/**
 * @param {string} word
 * @returns {string}
 */
function normalizeWord(word) {
    return word.toLowerCase().trim();
}

/**
 * @param {string} word
 * @returns {boolean}
 */
function isValidWord(word) {
    if (!word || word.length < MIN_LENGTH) return false;
    if (word.length > MAX_LENGTH) return false;
    return RE_VALID.test(word);
}

module.exports = { normalizeWord, isValidWord };
