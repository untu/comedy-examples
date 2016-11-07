'use strict';

var actors = require('comedy');
var P = require('bluebird');

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
  // Create a class-defined child actor.
  .then(rootActor => rootActor.createChild(MyActor, {
    mode: 'forked', // Spawn separate process.
    clusterSize: 3 // Spawn 3 instances of this actor to load-balance over.
  }))
  .then(myActor => {
    // Sequentially send 6 messages to our newly-created actor cluster.
    // The messages will be load-balanced between 3 forked actors using
    // the default balancing strategy (round-robin).
    return P.each([1, 2, 3, 4, 5, 6], number => {
      return myActor.sendAndReceive('sayHello', `${process.pid}-${number}`)
        .then(reply => {
          console.log(`Actor replied: ${reply}`);
        });
    });
  })
  .finally(() => actorSystem.destroy());
