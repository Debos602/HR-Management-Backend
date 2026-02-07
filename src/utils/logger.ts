enum LogLevel {
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    DEBUG = 'DEBUG',
}

class Logger {
    private getTimestamp(): string {
        return new Date().toISOString();
    }

    private log(level: LogLevel, message: string, data?: any): void {
        const timestamp = this.getTimestamp();
        const logEntry = {
            timestamp,
            level,
            message,
            ...(data && { data }),
        };
        console.log(JSON.stringify(logEntry));
    }

    public info(message: string, data?: any): void {
        this.log(LogLevel.INFO, message, data);
    }

    public warn(message: string, data?: any): void {
        this.log(LogLevel.WARN, message, data);
    }

    public error(message: string, data?: any): void {
        this.log(LogLevel.ERROR, message, data);
    }

    public debug(message: string, data?: any): void {
        this.log(LogLevel.DEBUG, message, data);
    }
}

export const logger = new Logger();
