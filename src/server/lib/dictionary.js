'use strict';

const fs = require('fs');
const { DICT_PATH } = require('../config');
const { normalizeText } = require('./normalize');
const { enrichWord } = require('./word-metadata');

/**
 * @typedef {Object} WordEntry
 * @property {string} word
 * @property {string} norm
 * @property {number} len
 * @property {boolean} plural
 * @property {boolean} verb
 * @property {boolean} hyphen
 * @property {boolean} simple
 */

/**
 * @returns {WordEntry[]}
 */
function loadDictionary() {
    if (!fs.existsSync(DICT_PATH)) {
        console.error(`Dictionnaire introuvable : ${DICT_PATH}`);
        console.error('Exécutez "npm run build-dict" pour générer le fichier.');
        process.exit(1);
    }

    const raw = fs.readFileSync(DICT_PATH, 'utf8');
    const words = JSON.parse(raw);

    return words.map((word) => {
        const norm = normalizeText(word);
        return enrichWord(word, norm);
    });
}

module.exports = { loadDictionary };
