'use strict';

const { isProduction } = require('../config');

/**
 * @param {Error} err
 * @param {import('express').Request} _req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} _next
 */
function errorHandler(err, _req, res, _next) {
    if (!isProduction) {
        console.error(err);
    }

    if (res.headersSent) {
        return;
    }

    res.status(500).json({ error: 'probleme dans le serveur' });
}

module.exports = { errorHandler };
