declare module 'pino-multi-stream' {
    import { StreamEntry, Logger } from 'pino';

    export function multistream(streams: StreamEntry[]): Logger;
}
