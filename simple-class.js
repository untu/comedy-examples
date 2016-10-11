'use strict';

var actors = require('comedy');

/**
 * Actor definition class.
 */
class MyActor {
  sayHello(to) {
    console.log(`Hello, ${to}!`);
  }
}

actors()
  .rootActor() // Get a root actor reference.
  .then(rootActor => rootActor.createChild(MyActor)) // Create a class-defined child actor.
  .then(myActor => {
    // Our actor is ready, we can send messages to it.
    myActor.send('sayHello', 'world');
  });