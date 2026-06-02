import { SELECTORS } from './constants.js';

/**
 * @param {string} selector
 * @returns {HTMLElement}
 */
function requireElement(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        throw new Error(`je trouve pas l'élement ${selector}`);
    }
    return element;
}

export const dom = {
    input: requireElement(SELECTORS.searchInput),
    clearBtn: requireElement(SELECTORS.clearBtn),
    results: requireElement(SELECTORS.results),
    statsBar: requireElement(SELECTORS.statsBar),
    copyToast: requireElement(SELECTORS.copyToast),
    sortButtons: document.querySelectorAll(SELECTORS.sortButtons),
    filterButtons: document.querySelectorAll(SELECTORS.filterButtons),
};
