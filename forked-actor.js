'use strict';

var actors = require('comedy');

/**
 * Actor definition class.
 */
class MyActor {
  sayHello(to) {
    return `Hello ${to} from ${process.pid}!`;
  }
}

var actorSystem = actors();

actorSystem
  // Get a root actor reference.
  .rootActor()
  // Create a class-defined child actor, that is run in a separate process.
  .then(rootActor => rootActor.createChild(MyActor, { mode: 'forked' }))
  // Send a message to out forked actor.
  .then(myActor => myActor.sendAndReceive('sayHello', process.pid))
  .then(reply => {
    console.log(`Actor replied: ${reply}`);
  })
  .finally(() => actorSystem.destroy());

