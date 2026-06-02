'use strict';

const express = require('express');
const compression = require('compression');
const { CLIENT_DIR, isProduction, TRUST_PROXY } = require('./config');
const { loadDictionary } = require('./lib/dictionary');
const { createApiRouter } = require('./routes/api');
const { createContactRouter } = require('./routes/contact');
const { apiRateLimiter, securityHeaders } = require('./middleware/security');
const { errorHandler } = require('./middleware/error-handler');

/**
 * @returns {import('express').Express}
 */
function createApp() {
    const dictionary = loadDictionary();
    const app = express();

    if (TRUST_PROXY) {
        app.set('trust proxy', 1);
    }

    app.disable('x-powered-by');
    app.use(securityHeaders);
    app.use(compression());

    app.use(express.static(CLIENT_DIR, {
        dotfiles: 'deny',
        index: 'index.html',
        maxAge: isProduction ? '1d' : 0,
    }));

    app.use('/api', apiRateLimiter, createApiRouter(dictionary));
    app.use('/api', createContactRouter());

    app.use('/api', (_req, res) => {
        res.status(404).json({ error: 'jtrouve pas route' });
    });

    app.use(errorHandler);

    return app;
}

module.exports = { createApp };
