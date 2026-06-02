'use strict';

/**
 *
 * @param {string} text
 * @returns {string}
 */
function normalizeText(text) {
    return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
}

module.exports = { normalizeText };
