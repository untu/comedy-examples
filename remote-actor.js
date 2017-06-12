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
  // Create a class-defined child actor, that is run on a remote machine (remote mode).
  .then(rootActor => rootActor.createChild(MyActor, { mode: 'remote', host: '192.168.33.20' }))
  // Send a message to our remote actor with a self process PID.
  .then(myActor => myActor.sendAndReceive('sayHello', process.pid))
  .then(reply => {
    // Output result.
    console.log(`Actor replied: ${reply}`);
  })
  // Log errors.
  .catch(err => {
    console.error(err);
  })
  // Destroy the system, killing all actor processes.
  .finally(() => actorSystem.destroy());