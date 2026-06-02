'use strict';

const express = require('express');
const { searchDictionary } = require('../lib/search');
const { validateSearchQuery, sanitizeFilters } = require('../lib/validate-query');
const { toPublicWords } = require('../lib/public-word');

/**
 * @param {object[]} dictionary
 * @returns {import('express').Router}
 */
function createApiRouter(dictionary) {
    const router = express.Router();

    router.get('/info', (_req, res) => {
        res.json({ count: dictionary.length });
    });

    router.get('/search', (req, res, next) => {
        try {
            if (typeof req.query.q !== 'string') {
                return res.status(400).json({ error: 'paramètre requis' });
            }

            const validation = validateSearchQuery(req.query.q);

            if (!validation.valid) {
                return res.status(400).json({ error: validation.error });
            }

            const result = searchDictionary(dictionary, {
                q: validation.value,
                sort: req.query.sort,
                filters: sanitizeFilters(req.query.filters),
                limit: req.query.limit,
            });

            res.json({
                total: result.total,
                shown: result.shown,
                words: toPublicWords(result.words),
            });
        } catch (error) {
            next(error);
        }
    });

    return router;
}

module.exports = { createApiRouter };
