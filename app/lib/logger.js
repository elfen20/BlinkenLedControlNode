// logger.js
const path = require('path');
const pino = require('pino');
const config = require('config');
const loggerConfig = config.has('logger') ? config.logger : { path: '0.0.0.0'};

const logger = pino(
    {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    },
    pino.destination(path.join(loggerConfig.path, 'app.log'))
);

module.exports.logger = logger;