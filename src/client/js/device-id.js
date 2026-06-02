const STORAGE_KEY = 'wb_client_id';

const RE_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 *
 * 
 * @returns {string}
 */
export function getClientId() {
    let id = localStorage.getItem(STORAGE_KEY);

    if (!id || !RE_UUID.test(id)) {
        id = crypto.randomUUID();
        localStorage.setItem(STORAGE_KEY, id);
    }

    return id;
}
