type LogLevel = 'debug' | 'info' | 'warn' | 'error';

function shouldLog(level: LogLevel) {
  if (process.env.NODE_ENV !== 'production') {
    return true;
  }

  return level === 'warn' || level === 'error';
}

function log(level: LogLevel, message: string, context?: unknown) {
  if (!shouldLog(level)) {
    return;
  }

  console[level](`[vendora] ${message}`, context ?? '');
}

export const logger = {
  debug: (message: string, context?: unknown) => log('debug', message, context),
  info: (message: string, context?: unknown) => log('info', message, context),
  warn: (message: string, context?: unknown) => log('warn', message, context),
  error: (message: string, context?: unknown) => log('error', message, context)
};
