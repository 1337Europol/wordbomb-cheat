'use strict';

/**
 * @typedef {Object} PublicWord
 * @property {string} word
 * @property {number} len
 * @property {boolean} plural
 * @property {boolean} verb
 * @property {boolean} hyphen
 */

/**
 *
 * @param {{ word: string, len: number, plural: boolean, verb: boolean, hyphen: boolean }} entry
 * @returns {PublicWord}
 */
function toPublicWord(entry) {
    return {
        word: entry.word,
        len: entry.len,
        plural: entry.plural,
        verb: entry.verb,
        hyphen: entry.hyphen,
    };
}

/**
 * @param {object[]} entries
 * @returns {PublicWord[]}
 */
function toPublicWords(entries) {
    return entries.map(toPublicWord);
}

module.exports = { toPublicWord, toPublicWords };
