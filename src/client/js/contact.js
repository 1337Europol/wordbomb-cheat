import { SITE_CONFIG } from './site-config.js';
import { getClientId } from './device-id.js';

const form = document.querySelector('.contact-form');
const feedback = document.getElementById('formFeedback');
const submitBtn = form?.querySelector('.form-submit');

function setGithubLinks() {
    if (!SITE_CONFIG.githubUrl || SITE_CONFIG.githubUrl.includes('TON-USERNAME')) {
        return;
    }

    document.querySelectorAll('[data-github-link]').forEach((link) => {
        link.href = SITE_CONFIG.githubUrl;
    });

    document.querySelectorAll('[data-github-issues]').forEach((link) => {
        link.href = `${SITE_CONFIG.githubUrl}/issues/new`;
    });
}

/**
 * @param {'success' | 'error'} type
 * @param {string} message
 */
function showFeedback(type, message) {
    if (!feedback) return;

    feedback.textContent = message;
    feedback.className = `form-feedback form-feedback--${type}`;
    feedback.hidden = false;
}

function setLoading(isLoading) {
    if (!submitBtn) return;

    submitBtn.disabled = isLoading;
    submitBtn.textContent = isLoading ? 'Envoi…' : 'Envoyer';
}

if (form) {
    setGithubLinks();

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        setLoading(true);
        if (feedback) feedback.hidden = true;

        const formData = new FormData(form);
        const payload = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            website: formData.get('website') || '',
        };

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Client-Id': getClientId(),
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json().catch(() => ({}));

            if (response.status === 429) {
                showFeedback('error', result.error || 'trop de messages réessaie plus tard');
                return;
            }

            if (!response.ok) {
                showFeedback('error', result.error || 'arrive pas a envoyer le message');
                return;
            }

            form.reset();
            showFeedback('success', 'message envoyé le créateur te répondra par e-mail');
        } catch {
            showFeedback('error', 'probleme réseau vérifie ta connexion');
        } finally {
            setLoading(false);
        }
    });
}
