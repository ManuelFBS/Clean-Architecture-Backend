/*
import { Console } from 'console';

export const Logger = new Console({
    stdout: process.stdout,
    stderr: process.stderr,
    colorMode: true,
});

export default {
    info: (...args: any) => Logger.log('[INFO]', ...args),
    error: (...args: any) =>
        Logger.error('[ERROR]', ...args),
    warn: (...args: any) => Logger.warn('[WARN]', ...args),
    debug: (...args: any) => Logger.log('[DEBUG]', ...args),
};
*/

export class Logger {
    info(...args: any[]) {
        console.log('[INFO]', ...args);
    }
    error(...args: any[]) {
        console.error('[ERROR]', ...args);
    }
    warn(...args: any[]) {
        console.warn('[WARN]', ...args);
    }
    debug(...args: any[]) {
        console.log('[DEBUG]', ...args);
    }
}
