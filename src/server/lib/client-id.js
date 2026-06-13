'use strict';

const RE_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * @param {unknown} valeur lol
 * @returns {boolean}
 */
function isValidClientId(value) {
    return typeof value === 'string' && RE_UUID.test(value);
}

/**
 * @param {import('express').Request} req
 * @returns {string | null}
 */
function extractClientId(req) {
    const header = req.get('X-Client-Id');
    if (isValidClientId(header)) {
        return header;
    }

    const body = req.body?.clientId;
    if (isValidClientId(body)) {
        return body;
    }

    return null;
}

module.exports = { isValidClientId, extractClientId };
