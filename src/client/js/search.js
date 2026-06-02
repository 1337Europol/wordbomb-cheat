import { DEBOUNCE_MS, QUERY_MIN_LENGTH, SEARCH_LIMIT } from './constants.js';
import { fetchSearchResults } from './api.js';
import { isQueryValid } from './validate.js';
import {
    renderError,
    renderLoading,
    renderStats,
    renderWelcome,
    renderWords,
} from './render.js';

export class SearchController {
    /**
     * @param {{
     *   input: HTMLInputElement,
     *   results: HTMLElement,
     *   statsBar: HTMLElement,
     * }} elements
     */
    constructor(elements) {
        this.input = elements.input;
        this.results = elements.results;
        this.statsBar = elements.statsBar;

        this.sortMode = 'length';
        this.activeFilters = new Set();
        this.debounceTimer = null;
        this.lastQuery = '';
    }

    /**
     * @param {'length' | 'alpha'} mode
     */
    setSortMode(mode) {
        this.sortMode = mode;
        this.runIfQueryPresent();
    }

    /**
     * @param {string} filter
     * @returns {boolean}
     */
    toggleFilter(filter) {
        if (this.activeFilters.has(filter)) {
            this.activeFilters.delete(filter);
            return false;
        }

        this.activeFilters.add(filter);
        return true;
    }

    scheduleSearch() {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => this.runSearch(), DEBOUNCE_MS);
    }

    runIfQueryPresent() {
        if (this.input.value.trim()) {
            this.runSearch();
        }
    }

    clear() {
        this.input.value = '';
        this.results.innerHTML = '';
        this.statsBar.innerHTML = '';
        renderWelcome(this.results);
        this.input.focus();
    }

    async runSearch() {
        const query = this.input.value.trim().toLowerCase();
        this.lastQuery = query;

        if (!query) {
            this.results.innerHTML = '';
            this.statsBar.innerHTML = '';
            renderWelcome(this.results);
            return;
        }

        if (query.length < QUERY_MIN_LENGTH) {
            this.statsBar.innerHTML = '';
            renderWelcome(this.results, `minimum ${QUERY_MIN_LENGTH} caractères`);
            return;
        }

        if (!isQueryValid(query)) {
            this.statsBar.innerHTML = '';
            renderError(this.results, 'Caractères non autorisés');
            return;
        }

        renderLoading(this.results);

        const params = new URLSearchParams({
            q: query,
            sort: this.sortMode,
            filters: Array.from(this.activeFilters).join(','),
            limit: String(SEARCH_LIMIT),
        });

        try {
            const data = await fetchSearchResults(params);

            if (this.lastQuery !== query) {
                return;
            }

            renderStats(this.statsBar, data.total, query, data.shown);
            renderWords(this.results, data.words, query);
        } catch (error) {
            renderError(this.results, error.message || 'problème serveur');
        }
    }
}
