/**
 * Actor that finds prime numbers.
 */
class PrimeFinderActor {
  /**
   * Finds next prime, starting from a given number (not inclusive).
   *
   * @param {Number} n Number to start from.
   * @returns {Number} Prime number next to n.
   */
  nextPrime(n) {
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

const pf = new PrimeFinderActor();

console.log(pf.nextPrime(1024102400));