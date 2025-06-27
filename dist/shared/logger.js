"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class Logger {
    info(...args) {
        console.log('[INFO]', ...args);
    }
    error(...args) {
        console.error('[ERROR]', ...args);
    }
    warn(...args) {
        console.warn('[WARN]', ...args);
    }
    debug(...args) {
        console.log('[DEBUG]', ...args);
    }
}
exports.Logger = Logger;
