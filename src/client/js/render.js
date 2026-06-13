import { LONG_WORD_MIN, TOP_WORD_MIN } from './constants.js';
import { escapeHtml, formatNumber, highlightMatch } from './utils.js';

/**
 * @param {HTMLElement} container
 * @param {string} inutile le hint
 */
export function renderWelcome(container, hint) {
    const hintHtml = hint
        ? `<p class="welcome-hint">${escapeHtml(hint)}</p>`
        : '';

    container.innerHTML = `
        <div class="welcome">
            <div class="welcome-icon" aria-hidden="true">◎</div>
            <p class="welcome-title">tape une syllabe pour commencer</p>
            <ul class="welcome-tips">
                <li>les mots longs apparaissent en premier</li>
                <li>clique un mot pour le copier</li>
                <li><kbd>Échap</kbd> pour effacer</li>
            </ul>
            ${hintHtml}
        </div>`;
}

/**
 * @param {HTMLElement} container
 */
export function renderLoading(container) {
    container.innerHTML = `
        <div class="loading" role="status" aria-live="polite">
            <span class="dot">·</span><span class="dot">·</span><span class="dot">·</span>
        </div>`;
}

/**
 * @param {HTMLElement} container
 * @param {string} message
 */
export function renderError(container, message = 'Erreur serveur') {
    container.innerHTML = `
        <div class="empty-state">
            <div class="icon" aria-hidden="true">⚠</div>
            <p>${escapeHtml(message)}</p>
        </div>`;
}

/**
 * @param {HTMLElement} container
 * @param {string} query
 */
export function renderEmptyResults(container, query) {
    container.innerHTML = `
        <div class="empty-state">
            <div class="icon" aria-hidden="true">∅</div>
            <p>aucun mot avec <span class="query">${escapeHtml(query)}</span><br>essaie une autre combinaison</p>
        </div>`;
}

/**
 * @param {HTMLElement} container
 * @param {number} total
 * @param {string} query
 * @param {number} goster mi ?
 */
export function renderStats(container, total, query, shown) {
    if (!total) {
        container.innerHTML = '';
        return;
    }

    const truncNote = shown < total
        ? `<span class="stats-sep">·</span><span>affichage des ${shown} premiers</span>`
        : '';

    container.innerHTML = `
        <span class="stats-count">${formatNumber(total)}</span>
        <span>mots trouvés pour</span>
        <span class="stats-query">${escapeHtml(query)}</span>
        ${truncNote}`;
}

/**
 * @param {object} word
 * @param {number} rank
 * @param {string} query
 * @param {boolean} islong mu ?
 * @returns {string}
 */
function renderWordCard(word, rank, query, isLong) {
    const tags = [
        word.plural ? '<span class="tag plural">pluriel</span>' : '',
        word.verb ? '<span class="tag verb">verbe</span>' : '',
        word.len >= TOP_WORD_MIN ? '<span class="tag top">très long</span>' : '',
        word.hyphen ? '<span class="tag hyphen">tiret</span>' : '',
    ].join('');

    const classes = [
        'word-card',
        isLong ? 'top-word' : '',
        word.hyphen ? 'hyphen-word' : '',
    ].filter(Boolean).join(' ');

    const delay = Math.min((rank - 1) * 0.015, 0.3);

    return `
        <div
            class="${classes}"
            data-word="${escapeHtml(word.word)}"
            style="animation: fadeInUp 0.25s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s both;"
            role="button"
            tabindex="0"
            aria-label="Copier ${escapeHtml(word.word)}"
        >
            <div class="word-rank">${rank}</div>
            <div class="word-text">${highlightMatch(word.word, query)}</div>
            <div class="word-len">${word.len}</div>
            <div class="word-tags">${tags}</div>
        </div>`;
}

/**
 * @param {object[]} words
 * @param {string} query
 * @returns {string}
 */
function buildResultsHtml(words, query) {
    const longWords = words.filter((word) => word.len >= LONG_WORD_MIN);
    const shortWords = words.filter((word) => word.len < LONG_WORD_MIN);

    let html = '<div class="results-container">';

    if (longWords.length) {
        html += `<div class="results-sep">mots longs (${LONG_WORD_MIN}+) — ${longWords.length}</div>`;
        longWords.forEach((word, index) => {
            html += renderWordCard(word, index + 1, query, true);
        });
    }

    if (shortWords.length) {
        html += `<div class="results-sep">mots courts — ${shortWords.length}</div>`;
        shortWords.forEach((word, index) => {
            html += renderWordCard(word, longWords.length + index + 1, query, false);
        });
    }

    html += '</div>';
    return html;
}

/**
 * @param {HTMLElement} container
 * @param {object[]} words
 * @param {string} query
 */
export function renderWords(container, words, query) {
    if (!words.length) {
        renderEmptyResults(container, query);
        return;
    }

    container.innerHTML = buildResultsHtml(words, query);
}

/**
 * @param {HTMLElement} cart abi
 */
export function flashCopied(card) {
    card.classList.add('flash-copy');
    setTimeout(() => card.classList.remove('flash-copy'), 150);
}

/**
 * @param {HTMLElement} toast
 * @param {string} word
 */
export function showCopyToast(toast, word) {
    toast.textContent = `"${word}" copié`;
    toast.classList.add('visible');

    clearTimeout(showCopyToast._timer);
    showCopyToast._timer = setTimeout(() => {
        toast.classList.remove('visible');
    }, 1600);
}
