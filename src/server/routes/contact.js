'use strict';

const express = require('express');
const { validateContactBody } = require('../lib/validate-contact');
const { sendContactEmail } = require('../lib/contact-mailer');
const { logContactSubmission } = require('../lib/contact-tracker');
const { contactGuard } = require('../middleware/contact-guard');

/**
 * @returns {import('express').Router}
 */
function createContactRouter() {
    const router = express.Router();

    router.post(
        '/contact',
        express.json({ limit: '8kb' }),
        contactGuard,
        async (req, res, next) => {
            try {
                if (req.body?.website) {
                    return res.json({ success: true });
                }

                const validation = validateContactBody(req.body);

                if (!validation.valid) {
                    return res.status(400).json({ error: validation.error });
                }

                await sendContactEmail(validation.data);

                logContactSubmission({
                    ip: req.contactMeta.ip,
                    clientId: req.contactMeta.clientId,
                    userAgent: req.contactMeta.userAgent,
                    subject: validation.data.subject,
                    email: validation.data.email,
                });

                res.json({ success: true });
            } catch (error) {
                next(error);
            }
        }
    );

    return router;
}

module.exports = { createContactRouter };
