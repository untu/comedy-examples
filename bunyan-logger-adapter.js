const bunyan = require('bunyan');

/**
 * Adapts Bunyan logger to Comedy actor system. There are
 * 4 required methods that should be implemented in this adapter:
 * error(), warn(), info(), and debug().
 */
class BunyanLoggerAdapter {
  constructor(config) {
    this.log = bunyan.createLogger(config || { name: 'comedy-examples' });
  }

  error(...msg) {
    this.log.error(...msg);
  }

  warn(...msg) {
    this.log.warn(...msg);
  }

  info(...msg) {
    this.log.info(...msg);
  }

  debug(...msg) {
    this.log.debug(...msg);
  }
}

module.exports = BunyanLoggerAdapter;