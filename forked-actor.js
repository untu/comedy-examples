'use strict';

var actors = require('comedy');

/**
 * Actor definition class.
 */
class MyActor {
  sayHello(to) {
    // Reply with a message, containing self PID.
    return `Hello to ${to} from ${process.pid}!`;
  }
}

// Create an actor system.
var actorSystem = actors();

actorSystem
  // Get a root actor reference.
  .rootActor()
  // Create a class-defined child actor, that is run in a separate process (forked mode).
  .then(rootActor => rootActor.createChild(MyActor, { mode: 'forked' }))
  // Send a message to our forked actor with a self process PID.
  .then(myActor => myActor.sendAndReceive('sayHello', process.pid))
  .then(reply => {
    console.log(`Actor replied: ${reply}`);
  })
  .finally(() => actorSystem.destroy());
