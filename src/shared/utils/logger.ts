type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogMessage {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
}

class Logger {
  private formatMessage(level: LogLevel, message: string, data?: any): LogMessage {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...(data && { data }),
    };
  }

  private log(level: LogLevel, message: string, data?: any): void {
    const logMessage = this.formatMessage(level, message, data);

    switch (level) {
      case 'error':
        console.error(JSON.stringify(logMessage, null, 2));
        break;
      case 'warn':
        console.warn(JSON.stringify(logMessage, null, 2));
        break;
      case 'debug':
        if (process.env.NODE_ENV === 'development') {
          console.debug(JSON.stringify(logMessage, null, 2));
        }
        break;
      default:
        console.log(JSON.stringify(logMessage, null, 2));
    }
  }

  info(message: string, data?: any): void {
    this.log('info', message, data);
  }

  warn(message: string, data?: any): void {
    this.log('warn', message, data);
  }

  error(message: string, data?: any): void {
    this.log('error', message, data);
  }

  debug(message: string, data?: any): void {
    this.log('debug', message, data);
  }
}

export const logger = new Logger();
