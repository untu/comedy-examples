'use strict';

/**
 * To successfully run this example, you need to first launch a Comedy listener
 * node on this host. To do that, run:
 *
 * $ node_modules/.bin/comedy-node
 *
 * You can also launch a listener node on the host of your choice and change the
 * remote IP address in this example (remoteIpAddress variable) to check real
 * network communication.
 *
 * To start listener node on remote machine, do:
 *
 * $ npm install comedy
 * $ node_modules/.bin/comedy-node
 *
 * in any folder on remote machine.
 */

var actors = require('comedy');

// Remote IP address. You can change it to a different IP address.
// If Comedy node is started and accessible on that address, the example will work.
var remoteIpAddress = '127.0.0.1';

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
  .then(rootActor => rootActor.createChild(MyActor, { mode: 'remote', host: remoteIpAddress }))
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