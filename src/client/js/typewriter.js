import { PLACEHOLDER_PHRASES } from './constants.js';

const TYPE_SPEED = {
    typing: 120,
    deleting: 40,
    pauseEnd: 1200,
    pauseStart: 300,
};

/**
 * @param {HTMLInputElement} input
 */
export function startTypewriterPlaceholder(input) {
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function tick() {
        const currentPhrase = PLACEHOLDER_PHRASES[phraseIndex];

        if (isDeleting) {
            charIndex--;
        } else {
            charIndex++;
        }

        input.placeholder = currentPhrase.substring(0, charIndex);

        let delay = isDeleting ? TYPE_SPEED.deleting : TYPE_SPEED.typing;

        if (!isDeleting && charIndex === currentPhrase.length) {
            delay = TYPE_SPEED.pauseEnd;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % PLACEHOLDER_PHRASES.length;
            delay = TYPE_SPEED.pauseStart;
        }

        setTimeout(tick, delay);
    }

    tick();
}
