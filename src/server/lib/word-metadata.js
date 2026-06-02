'use strict';

const VERB_SUFFIXES = ['er', 'ir', 'oir', 're'];

/**
 * @param {string} word
 * @returns {boolean}
 */
function isPlural(word) {
    return (word.endsWith('s') || word.endsWith('x')) && word.length > 3;
}

/**
 * @param {string} word
 * @returns {boolean}
 */
function isVerb(word) {
    if (isPlural(word)) {
        return false;
    }

    const bare = word.replace(/-[a-zA-Z]+$/, '');
    return VERB_SUFFIXES.some((suffix) => bare.endsWith(suffix));
}

/**
 *
 * @param {string} word
 * @param {string} norm
 * @returns {import('../types').WordEntry}
 */
function enrichWord(word, norm) {
    return {
        word,
        norm,
        len: word.length,
        plural: isPlural(word),
        verb: isVerb(word),
        hyphen: word.includes('-'),
        simple: !word.includes('-') && !word.includes("'"),
    };
}

module.exports = { enrichWord, isPlural, isVerb };
