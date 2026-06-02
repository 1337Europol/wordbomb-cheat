import { dom } from './dom.js';
import { SearchController } from './search.js';
import { sanitizeQuery } from './validate.js';
import { flashCopied, showCopyToast, renderWelcome } from './render.js';
import { startTypewriterPlaceholder } from './typewriter.js';

function bindSearchInput(search) {
    dom.input.addEventListener('input', () => {
        const cleaned = sanitizeQuery(dom.input.value);

        if (cleaned !== dom.input.value) {
            dom.input.value = cleaned;
        }

        dom.clearBtn.classList.toggle('visible', dom.input.value.length > 0);
        search.scheduleSearch();
    });

    dom.clearBtn.addEventListener('click', () => {
        dom.clearBtn.classList.remove('visible');
        search.clear();
    });

    dom.input.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            dom.clearBtn.classList.remove('visible');
            search.clear();
        }
    });
}

function bindSortButtons(search) {
    dom.sortButtons.forEach((button) => {
        button.addEventListener('click', () => {
            dom.sortButtons.forEach((btn) => btn.classList.remove('active'));
            button.classList.add('active');
            search.setSortMode(button.dataset.sort);
        });
    });
}

function bindFilterButtons(search) {
    dom.filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const isActive = search.toggleFilter(button.dataset.filter);
            button.classList.toggle('active', isActive);
            search.runIfQueryPresent();
        });
    });
}

function bindResultsCopy() {
    async function copyWord(card) {
        const word = card.dataset.word;
        if (!word) return;

        try {
            await navigator.clipboard.writeText(word);
            flashCopied(card);
            showCopyToast(dom.copyToast, word);
        } catch {
            showCopyToast(dom.copyToast, 'copie impossible');
        }
    }

    dom.results.addEventListener('click', (event) => {
        const card = event.target.closest('.word-card');
        if (card) copyWord(card);
    });

    dom.results.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;

        const card = event.target.closest('.word-card');
        if (!card) return;

        event.preventDefault();
        copyWord(card);
    });
}

function bootstrap() {
    const search = new SearchController({
        input: dom.input,
        results: dom.results,
        statsBar: dom.statsBar,
    });

    bindSearchInput(search);
    bindSortButtons(search);
    bindFilterButtons(search);
    bindResultsCopy();

    renderWelcome(dom.results);
    startTypewriterPlaceholder(dom.input);
}

bootstrap();
