// Logger service for consistent logging across environments
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerConfig {
  minLevel: LogLevel;
  includeTimestamp: boolean;
  includeStacktrace: boolean;
  performanceTracking: boolean;
}

class Logger {
  private static instance: Logger;
  private isDevelopment: boolean;
  private config: LoggerConfig;
  private performanceMarks: Map<string, number>;

  private constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.performanceMarks = new Map();
    this.config = {
      minLevel: this.isDevelopment ? 'debug' : 'info',
      includeTimestamp: true,
      includeStacktrace: true,
      performanceTracking: true
    };
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.config.minLevel);
  }

  private formatMessage(level: LogLevel, message: string, ...args: any[]): string {
    const parts: string[] = [];

    if (this.config.includeTimestamp) {
      parts.push(`[${new Date().toISOString()}]`);
    }

    parts.push(`[${level.toUpperCase()}]`);
    parts.push(message);

    if (args.length > 0) {
      try {
        const formattedArgs = args.map(arg => {
          if (arg instanceof Error) {
            return {
              message: arg.message,
              stack: this.config.includeStacktrace ? arg.stack : undefined
            };
          }
          return arg;
        });
        parts.push(JSON.stringify(formattedArgs, null, 2));
      } catch (e) {
        parts.push('[Unable to stringify arguments]');
      }
    }

    return parts.join(' ');
  }

  private log(level: LogLevel, message: string, ...args: any[]): void {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatMessage(level, message, ...args);
    
    if (this.isDevelopment) {
      switch (level) {
        case 'debug':
          console.debug(formattedMessage);
          break;
        case 'info':
          console.info(formattedMessage);
          break;
        case 'warn':
          console.warn(formattedMessage);
          break;
        case 'error':
          console.error(formattedMessage);
          break;
      }
    } else {
      // In production, use console.log for Netlify
      console.log(formattedMessage);
    }
  }

  // Performance tracking methods
  public startPerformanceMark(markName: string): void {
    if (this.config.performanceTracking) {
      this.performanceMarks.set(markName, performance.now());
    }
  }

  public endPerformanceMark(markName: string): void {
    if (this.config.performanceTracking) {
      const startTime = this.performanceMarks.get(markName);
      if (startTime) {
        const duration = performance.now() - startTime;
        this.info(`Performance mark "${markName}" took ${duration.toFixed(2)}ms`);
        this.performanceMarks.delete(markName);
      }
    }
  }

  // Standard logging methods
  public debug(message: string, ...args: any[]): void {
    this.log('debug', message, ...args);
  }

  public info(message: string, ...args: any[]): void {
    this.log('info', message, ...args);
  }

  public warn(message: string, ...args: any[]): void {
    this.log('warn', message, ...args);
  }

  public error(message: string, ...args: any[]): void {
    this.log('error', message, ...args);
  }

  // API logging methods
  public logApiRequest(method: string, url: string, data?: any): void {
    this.debug(`API Request: ${method} ${url}`, { data });
  }

  public logApiResponse(method: string, url: string, status: number, data?: any): void {
    this.debug(`API Response: ${method} ${url} ${status}`, { data });
  }

  public logApiError(method: string, url: string, error: any): void {
    this.error(`API Error: ${method} ${url}`, error);
  }
}

export const logger = Logger.getInstance(); 