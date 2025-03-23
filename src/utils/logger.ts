import { pino } from 'pino';
import { multistream } from 'pino-multi-stream';
import fs from 'fs';
import path from 'path';
import { createStream } from 'rotating-file-stream';

const logDirectory = path.join(process.cwd(), 'logs');

const logFileName = (): string => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}.log`;
};

if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}

const logStream = createStream(logFileName(), {
    interval: '1d',
    path: logDirectory,
    size: '10M',
    compress: 'gzip',
    maxFiles: 30,
});

const streams: pino.StreamEntry[] = [
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
    multistream(streams) as unknown as pino.DestinationStream
);

export const logger = {
    info: (message: string) => pinoLogger.info(message),
    error: (message: string) => pinoLogger.error(message),
    warn: (message: string) => pinoLogger.warn(message),
    debug: (message: string) => pinoLogger.debug(message),
    fatal: (message: string) => pinoLogger.fatal(message),
};