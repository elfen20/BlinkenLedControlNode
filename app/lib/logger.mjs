// logger.js

import path from 'node:path';
import config from 'config';
const loggerConfig = config.has('logger') ? config.logger : { path: '"./logs"', level: 'debug' };
import pino from 'pino';

const transports = [
    /*
    {
        target: 'pino-loki',
        options: {
            host: 'http://localhost:3100',
        }
    },
    */
    {
        target: 'pino/file',
        options: { destination: path.join(loggerConfig.path, 'app.log') }
    }];

const pLogger = pino({
    level: loggerConfig.level,
    transport: {
        targets: transports
    }
});

export default pLogger