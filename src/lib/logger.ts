/**
 * Structured logging utility for LaunchFast
 *
 * Production-ready logging with different levels and optional integrations.
 * Logs are structured JSON in production for easy parsing by log aggregators.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  /**
   * Log a debug message (only in development)
   */
  debug(message: string, context?: LogContext): void {
    if (!this.isDevelopment) return;
    this.log('debug', message, context);
  }

  /**
   * Log an info message
   */
  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }

  /**
   * Log a warning message
   */
  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }

  /**
   * Log an error message
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext = error instanceof Error
      ? {
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack,
          },
          ...context,
        }
      : { error, ...context };

    this.log('error', message, errorContext);

    // Send to Sentry if configured
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, {
        extra: context,
      });
    }
  }

  /**
   * Core logging function
   */
  private log(level: LogLevel, message: string, context?: LogContext): void {
    const timestamp = new Date().toISOString();

    if (this.isDevelopment) {
      // Pretty console logs in development
      const emoji = {
        debug: '🐛',
        info: 'ℹ️',
        warn: '⚠️',
        error: '❌',
      }[level];

      console[level === 'debug' ? 'log' : level](
        `${emoji} [${timestamp}] ${message}`,
        context || ''
      );
    } else {
      // Structured JSON logs in production
      const logEntry = {
        timestamp,
        level,
        message,
        ...context,
      };

      console[level === 'debug' ? 'log' : level](JSON.stringify(logEntry));
    }
  }
}

// Export singleton instance
export const logger = new Logger();
