'use strict';

var actors = require('comedy');

/**
 * Sample actor.
 */
class MyActor {
  // ...Some useful code.

  metrics() {
    return {
      requestsPerSecond: Math.floor(Math.random() * 100) // Some real value should be here.
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

