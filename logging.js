'use strict';

var actors = require('comedy');

// Create an actor system.
var actorSystem = actors();

/**
 * Example actor definition.
 */
class MyActor {
  initialize(selfActor) {
    // Output actor-level log message.
    selfActor.getLog().info('MyActor initialized.');
  }
}

actorSystem
  .rootActor()
  .then(rootActor => {
    // Output system-level log message.
    actorSystem.getLog().info('Actor system initialized. Creating MyActor actor...');

    return rootActor.createChild(MyActor);
  });