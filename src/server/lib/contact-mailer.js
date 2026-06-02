'use strict';

const SUBJECT_LABELS = {
    bug: 'Signaler un bug',
    word: 'Mot manquant',
    idea: 'Suggestion',
    other: 'Autre',
};

/**
 *
 * @param {{ name: string, email: string, subject: string, message: string }} data
 */
async function sendContactEmail(data) {
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

    if (!accessKey) {
        throw new Error('contact non config sur le serveur');
    }

    const payload = new URLSearchParams({
        access_key: accessKey,
        name: data.name,
        email: data.email,
        subject: `[Word Bomb] ${SUBJECT_LABELS[data.subject] || data.subject}`,
        message: data.message,
    });

    const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload,
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
        throw new Error('arrive pas a envoyer le message');
    }
}

module.exports = { sendContactEmail };
