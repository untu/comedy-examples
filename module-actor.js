var actors = require('comedy');

actors()
  .rootActor() // Get a root actor reference.
  .then(rootActor => rootActor.createChild('/actors/MyActor')) // Create a module-defined child actor.
  .then(myActor => {
    // Our actor is ready, we can send messages to it.
    myActor.send('sayHello', 'world');
  });