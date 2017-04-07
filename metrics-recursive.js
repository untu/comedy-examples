'use strict';

var actors = require('comedy');

/**
 * Sample actor.
 */
class MyActor {
  initialize(selfActor) {
    return selfActor.createChild(MyChildActor);
  }

  metrics() {
    return {
      requestsPerSecond: Math.floor(Math.random() * 100) // Some real value should be here.
    };
  }
}

/**
 * Sample child actor.
 */
class MyChildActor {
  // ...Some useful code.

  metrics() {
    return {
      ignoredMessages: 0
    };
  }
}

actors()
  .rootActor() // Get a root actor reference.
  .then(rootActor => rootActor.createChild(MyActor)) // Create a child actor.
  .then(myActor => myActor.metrics()) // Query actor metrics.
  .then(metrics => {
    console.log('Actor metrics:', metrics); // Output actor metrics.
  });

