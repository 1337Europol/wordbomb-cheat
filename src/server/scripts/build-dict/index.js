'use strict';

const fs = require('fs');
const path = require('path');
const { fetchBuffer } = require('./fetch');
const { normalizeWord, isValidWord } = require('./validate');
const { DICT_PATH, CURATED_PATH } = require('../../config');

const REMOTE_SOURCES = [
    {
        label: 'an-array-of-french-words',
        url: 'https://raw.githubusercontent.com/words/an-array-of-french-words/master/index.json', // merci frw
        type: 'json',
    },
    {
        label: 'French-Wordlist',
        url: 'https://raw.githubusercontent.com/Taknok/French-Wordlist/master/francais.txt', // merci frw
        type: 'text',
    },
];

/**
 * @param {Buffer} buffer
 * @returns {string[]}
 */
function parseTextWordList(buffer) {
    let text = buffer.toString('utf8');
    if (text.includes('\uFFFD')) {
        text = buffer.toString('latin1');
    }

    return text
        .split(/\r?\n/)
        .map((line) => line.split(/[/\t ]/)[0].trim())
        .filter(Boolean);
}

/**
 * @param {{ url: string, type: string }} source
 * @returns {Promise<string[]>}
 */
async function fetchSourceWords(source) {
    const buffer = await fetchBuffer(source.url);

    if (source.type === 'json') {
        const data = JSON.parse(buffer.toString('utf8'));
        return Array.isArray(data) ? data : [];
    }

    return parseTextWordList(buffer);
}

/**
 * @param {Set<string>} words
 * @param {string[]} candidates
 * @returns {number}
 */
function addWords(words, candidates) {
    let added = 0;

    for (const candidate of candidates) {
        const normalized = normalizeWord(candidate);
        if (isValidWord(normalized) && !words.has(normalized)) {
            words.add(normalized);
            added++;
        }
    }

    return added;
}

/**
 * @param {Set<string>} words
 */
function loadCuratedWords(words) {
    if (!fs.existsSync(CURATED_PATH)) {
        return 0;
    }

    const curated = JSON.parse(fs.readFileSync(CURATED_PATH, 'utf8'));
    return addWords(words, curated);
}

async function buildDictionary() {
    const words = new Set();

    const curatedAdded = loadCuratedWords(words);
    console.log(`  Curated list : +${curatedAdded.toLocaleString('fr-FR')} mots`);

    for (const source of REMOTE_SOURCES) {
        try {
            const fetched = await fetchSourceWords(source);
            const added = addWords(words, fetched);
            console.log(`  ${source.label} : +${added.toLocaleString('fr-FR')} mots`);
        } catch (error) {
            console.warn(`  ${source.label} ignoré (${error.message})`);
        }
    }

    const sorted = Array.from(words)
        .filter(isValidWord)
        .sort((a, b) => a.localeCompare(b, 'fr'));

    fs.mkdirSync(path.dirname(DICT_PATH), { recursive: true });
    fs.writeFileSync(DICT_PATH, JSON.stringify(sorted), 'utf8');

    console.log(`\nDictionnaire écrit : ${sorted.length.toLocaleString('fr-FR')} mots`);
    console.log(`  → ${DICT_PATH}`);
}

buildDictionary().catch((error) => {
    console.error('big problème', error.message);
    process.exit(1);
});
