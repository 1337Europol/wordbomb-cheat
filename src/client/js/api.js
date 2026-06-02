/**
 * @template T
 * @param {string} url
 * @returns {Promise<T>}
 */
export async function apiFetch(url) {
    const response = await fetch(url);

    if (response.status === 429) {
        throw new Error('trop de requetes patiente un instant');
    }

    if (response.status === 400) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || 'requête invalide');
    }

    if (!response.ok) {
        throw new Error(`http ${response.status}`);
    }

    return response.json();
}

/**
 * @returns {Promise<{ count: number }>}
 */
export function fetchDictionaryInfo() {
    return apiFetch('/api/info');
}

/**
 * @param {URLSearchParams} params
 * @returns {Promise<{ total: number, shown: number, words: object[] }>}
 */
export function fetchSearchResults(params) {
    return apiFetch(`/api/search?${params}`);
}
