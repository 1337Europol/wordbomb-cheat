'use strict';

const VALID_SUBJECTS = new Set(['bug', 'word', 'idea', 'other']);

const LIMITS = {
    NAME_MIN: 2,
    NAME_MAX: 80,
    EMAIL_MAX: 120,
    MESSAGE_MIN: 10,
    MESSAGE_MAX: 2000,
};

const RE_NAME = /^[\p{L}\p{M}\s'.-]+$/u;
const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const RE_SUSPICIOUS = /(<script|javascript:|on\w+\s*=|data:text\/html)/i;

/**
 * @param {string} value
 * @returns {string}
 */
function sanitizeText(value) {
    return String(value || '')
        .replace(/[\0\x08\x0B\x0C\x0E-\x1F]/g, '')
        .replace(/<[^>]*>/g, '')
        .trim();
}

/**
 * @param {unknown} body
 * @returns {{ valid: true, data: object } | { valid: false, error: string }}
 */
function validateContactBody(body) {
    if (!body || typeof body !== 'object') {
        return { valid: false, error: 'Données invalides' };
    }

    const name = sanitizeText(body.name).slice(0, LIMITS.NAME_MAX);
    const email = sanitizeText(body.email).toLowerCase().slice(0, LIMITS.EMAIL_MAX);
    const subject = sanitizeText(body.subject);
    const message = sanitizeText(body.message).slice(0, LIMITS.MESSAGE_MAX);

    if (name.length < LIMITS.NAME_MIN) {
        return { valid: false, error: 'Nom invalide' };
    }

    if (!RE_NAME.test(name)) {
        return { valid: false, error: 'Nom : caractères non autorisés' };
    }

    if (!RE_EMAIL.test(email)) {
        return { valid: false, error: 'E-mail invalide' };
    }

    if (!VALID_SUBJECTS.has(subject)) {
        return { valid: false, error: 'Sujet invalide' };
    }

    if (message.length < LIMITS.MESSAGE_MIN) {
        return { valid: false, error: 'Message trop court' };
    }

    if (RE_SUSPICIOUS.test(message) || RE_SUSPICIOUS.test(name)) {
        return { valid: false, error: 'Contenu non autorisé' };
    }

    return {
        valid: true,
        data: { name, email, subject, message },
    };
}

module.exports = { validateContactBody };
