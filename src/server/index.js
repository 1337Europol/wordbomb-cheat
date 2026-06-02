'use strict';

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const { createApp } = require('./app');
const { PORT } = require('./config');

function start() {
    const app = createApp();

    app.listen(PORT, () => {
        console.log(`word bomb a start http://localhost:${PORT}`);
    });
}

if (require.main === module) {
    start();
}

module.exports = { createApp, start };
