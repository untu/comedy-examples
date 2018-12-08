const actors = require('comedy');
const bunyan = require('bunyan');

/**
 * This example demonstrates the use of custom logger that replaces
 * default Comedy logger. Here we use Bunyan for logging.
 */

/**
 * Adapts Bunyan logger to Comedy actor system. There are
 * 4 required methods that should be implemented in this adapter:
 * error(), warn(), info(), and debug().
 */
class BunyanLoggerAdapter {
  constructor() {
    this.log = bunyan.createLogger({ name: 'comedy-examples' });
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

/**
 * A test actor that uses logging.
 */
class TestActor {
  initialize(selfActor) {
    this.log = selfActor.getLog();

    this.log.info(`${selfActor.getName()} initialized!`);
  }

  test(msg) {
    this.log.info('Received test message:', msg);
  }
}

// We configure actor system to use our custom Bunyan-based logger.
// When actor system is created, we should already see some Bunyan messages
// in console.
let system = actors({
  root: TestActor,
  logger: BunyanLoggerAdapter
});

// Send a message to test actor. Another message should appear in log.
system.rootActor().then(actor => actor.sendAndReceive('test', 'Hello!'));