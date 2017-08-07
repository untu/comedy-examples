const actors = require('comedy');
const restify = require('restify');
const restifyErrors = require('restify-errors');
const P = require('bluebird');

/**
 * Actor that finds prime numbers.
 */
class PrimeFinderActor {
  /**
   * Finds next prime, starting from a given number (not inclusive).
   *
   * @param {Number} n Positive number to start from.
   * @returns {Number} Prime number next to n.
   */
  nextPrime(n) {
    if (n < 1) throw new Error('Illegal input');

    const n0 = n + 1;

    if (this._isPrime(n0)) return n0;

    return this.nextPrime(n0);
  }

  /**
   * Checks if a given number is prime.
   *
   * @param {Number} x Number to check.
   * @returns {Boolean} True if number is prime, false otherwise.
   * @private
   */
  _isPrime(x) {
    for (let i = 2; i < x; i++) {
      if (x % i === 0) return false;
    }

    return true;
  }
}

/**
 * Prime numbers REST server actor.
 */
class RestServerActor {
  /**
   * Actor initialization hook.
   *
   * @param {Actor} selfActor Self actor instance.
   * @returns {Promise} Initialization promise.
   */
  async initialize(selfActor) {
    this.log = selfActor.getLog();
    this.primeFinder = await selfActor.createChild(PrimeFinderActor);

    return this._initializeServer();
  }

  /**
   * Initializes REST server.
   *
   * @returns {P} Initialization promise.
   * @private
   */
  _initializeServer() {
    const server = restify.createServer({
      name: 'prime-finder'
    });

    server.get('/next-prime/:n', (req, res, next) => {
      this.log.info(`Handling next-prime request for number ${req.params.n}`);

      this.primeFinder.sendAndReceive('nextPrime', parseInt(req.params.n))
        .then(result => {
          this.log.info(`Handled next-prime request for number ${req.params.n}, result: ${result}`);
          res.send(200, result.toString());
        })
        .catch(err => {
          this.log.error(`Failed to handle next-prime request for number ${req.params.n}`, err);
          next(new restifyErrors.InternalError(err));
        });
    });

    return P.fromCallback(cb => {
      server.listen(8080, cb);
    });
  }
}

actors({ root: RestServerActor });