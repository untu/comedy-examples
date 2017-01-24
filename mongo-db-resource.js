'use strict';

var actors = require('comedy');
var mongodb = require('mongodb');

/**
 * MongoDB connection resource definition.
 */
class MongoDbConnectionResource {
  /**
   * Resource initialization logic.
   *
   * @param system Actor system instance.
   * @returns {Promise} Initialization promise.
   */
  initialize(system) {
    this.log = system.getLog();
    this.log.info('Initializing MongoDB connection resource...');

    return mongodb.MongoClient.connect('mongodb://localhost:27017/test')
      .then(connection => {
        this.log.info('MongoDB connection resource successfully initialized.');

        this.connection = connection;
      })
  }

  /**
   * Resource destruction logic.
   *
   * @returns {Promise} Destruction promise.
   */
  destroy() {
    this.log.info('Destroying MongoDB connection resource...');

    return this.connection.close().then(() => {
      this.log.info('MongoDB connection resource successfully destroyed.');
    });
  }

  /**
   * This method returns the actual resource, that will be used by actors.
   *
   * @returns {*} MongoDB Database instance.
   */
  getResource() {
    return this.connection;
  }
}

/**
 * Test actor, that works with MongoDB connection resource.
 */
class TestActor {
  /**
   * @returns {[String]} Names of injected resources (taken from resource class name
   * or getName() method, if present).
   */
  static inject() {
    return ['MongoDbConnectionResource'];
  }

  /**
   * @param mongoDb MongoDB Database instance (injected by Comedy).
   */
  constructor(mongoDb) {
    this.mongoDb = mongoDb;
  }

  /**
   * Actor initialization logic.
   *
   * @param selfActor Self actor instance.
   */
  initialize(selfActor) {
    this.log = selfActor.getLog();
  }

  /**
   * Dumps a given collection to stdout.
   *
   * @param {String} name Collection name.
   * @returns {Promise} Operation promise.
   */
  dumpCollection(name) {
    return this.mongoDb.collection(name).find({}).toArray().then(result => {
      result.forEach((obj, idx) => {
        this.log.info(`Collection "${name}", item #${idx}: ${JSON.stringify(obj, null, 2)}`);
      });
    });
  }
}

// Create actor system with MongoDB connection resource defined.
var system = actors({
  resources: [MongoDbConnectionResource]
});

system
  .rootActor()
  // Create test actor.
  .then(rootActor => rootActor.createChild(TestActor))
  // Send a 'dumpCollection' message and wait for processing to finish.
  .then(testActor => testActor.sendAndReceive('dumpCollection', 'test'))
  // Destroy the system.
  .finally(() => system.destroy());