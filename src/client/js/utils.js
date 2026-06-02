/**
 * @param {string} text
 * @returns {string}
 */
export function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

/**
 * @param {string} text
 * @returns {string}
 */
export function normalizeText(text) {
    return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
}

/**
 * @param {string} word
 * @param {string} query
 * @returns {string}
 */
export function highlightMatch(word, query) {
    const wordNorm = normalizeText(word);
    const queryNorm = normalizeText(query);
    const index = wordNorm.indexOf(queryNorm);

    if (index === -1) {
        return escapeHtml(word);
    }

    return (
        escapeHtml(word.slice(0, index)) +
        `<span class="highlight">${escapeHtml(word.slice(index, index + query.length))}</span>` +
        escapeHtml(word.slice(index + query.length))
    );
}

/**
 * @param {number} value
 * @param {string} [locale='fr-FR']
 * @returns {string}
 */
export function formatNumber(value, locale = 'fr-FR') {
    return value.toLocaleString(locale);
}
