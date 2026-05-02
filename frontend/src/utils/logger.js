/**
 * Custom Logger Middleware for Campus Notifications System
 */

const LOG_LEVELS = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG',
};

class Logger {
  constructor() {
    this.logs = [];
  }

  log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, level, message, data };
    
    // Store in memory (can be sent to server or localStorage if needed)
    this.logs.push(logEntry);

    // Color code console outputs for better visibility during dev
    const styleMap = {
      [LOG_LEVELS.INFO]: 'color: #3498db; font-weight: bold;',
      [LOG_LEVELS.WARN]: 'color: #f39c12; font-weight: bold;',
      [LOG_LEVELS.ERROR]: 'color: #e74c3c; font-weight: bold;',
      [LOG_LEVELS.DEBUG]: 'color: #9b59b6; font-weight: bold;',
    };

    console.log(`%c[${timestamp}] [${level}] ${message}`, styleMap[level], data ? data : '');
  }

  info(message, data) { this.log(LOG_LEVELS.INFO, message, data); }
  warn(message, data) { this.log(LOG_LEVELS.WARN, message, data); }
  error(message, data) { this.log(LOG_LEVELS.ERROR, message, data); }
  debug(message, data) { this.log(LOG_LEVELS.DEBUG, message, data); }

  getLogs() { return this.logs; }
}

export const logger = new Logger();
