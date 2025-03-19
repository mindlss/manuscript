const pino = require('pino');
const { multistream } = require('pino-multi-stream');
const fs = require('fs');
const path = require('path');
const rfs = require('rotating-file-stream');

const logDirectory = path.join(__dirname, '../../logs');
const logFileName = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}.log`;
};

if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

const logStream = rfs.createStream(logFileName(), {
    interval: '1d',
    path: logDirectory,
    size: '10M',
    compress: true,
    maxFiles: 30,
});

const streams = [
    {
        stream: pino.transport({
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'yyyy-mm-dd HH:MM:ss',
                ignore: 'pid,hostname',
                hideObject: true,
                sync: true,
            },
        }),
    },
    {
        stream: logStream,
    },
];

const pinoLogger = pino(
    {
        level: 'debug',
    },
    multistream(streams)
);

const logger = {
    info: (message) => pinoLogger.info(message),
    error: (message) => pinoLogger.error(message),
    warn: (message) => pinoLogger.warn(message),
    debug: (message) => pinoLogger.debug(message),
    fatal: (message) => pinoLogger.fatal(message),
};

module.exports = logger;
