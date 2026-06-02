'use strict';

const { extractClientId } = require('../lib/client-id');
const { getClientIp, checkContactRateLimit } = require('../lib/contact-tracker');

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function contactGuard(req, res, next) {
    const clientId = extractClientId(req);

    if (!clientId) {
        return res.status(400).json({ error: 'id navigateur manquant ou marche pas' });
    }

    const ip = getClientIp(req);
    const rateCheck = checkContactRateLimit(ip, clientId);

    if (!rateCheck.allowed) {
        return res.status(429).json({
            error: 'trop de messages réessaie plus tard',
        });
    }

    req.contactMeta = {
        ip,
        clientId,
        userAgent: req.get('User-Agent') || '',
    };

    next();
}

module.exports = { contactGuard };
