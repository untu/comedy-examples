const actors = require('comedy');

/**
 * This example demonstrates the use of custom logger that replaces
 * default Comedy logger. Here we use Bunyan for logging.
 */

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
  logger: '/bunyan-logger-adapter.js',
  loggerParams: { name: 'my-custom-logger' }
});

// Send a message to test actor. Another message should appear in log.
system.rootActor()
  .then(rootActor => rootActor.createChild(TestActor, { mode: 'forked' }))
  .then(actor => actor.sendAndReceive('test', 'Hello!'))
  .finally(() => system.destroy());