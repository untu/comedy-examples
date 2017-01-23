'use strict';

var actors = require('comedy');
var mongodb = require('mongodb');

class MongoDbConnectionResource {
  initialize(system) {
    this.log = system.getLog();
    this.log.info('Initializing MongoDB connection resource...');

    return mongodb.MongoClient.connect('mongodb://localhost:27017/test')
      .then(connection => {
        this.log.info('MongoDB connection resource successfully initialized.');

        this.connection = connection;
      })
  }

  destroy() {
    this.log.info('Destroying MongoDB connection resource...');

    return this.connection.close().then(() => {
      this.log.info('MongoDB connection resource successfully destroyed.');
    });
  }

  getResource() {
    return this.connection;
  }
}

class TestActor {
  static inject() {
    return ['MongoDbConnectionResource'];
  }

  constructor(mongoDb) {
    this.mongoDb = mongoDb;
  }

  initialize(selfActor) {
    return this.mongoDb.collection('test').find({}).toArray().then(result => {
      result.forEach((obj, idx) => {
        selfActor.getLog().info(`Query result #${idx}: ${JSON.stringify(obj, null, 2)}`);
      });
    });
  }
}

var system = actors({
  resources: [MongoDbConnectionResource]
});

system
  .rootActor()
  .then(rootActor => rootActor.createChild(TestActor))
  .finally(() => system.destroy());