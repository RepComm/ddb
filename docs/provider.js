export class ProviderMetrics {
  constructor() {
    this.timeLastCall = 0;
    this.timeLastEnlapsed = 0;
    this.timeLastSuccess = 0;
    this.countSuccess = 0;
  }

  start() {
    this.timeLastCall = Date.now();
  }

  end() {
    this.timeLastSuccess = Date.now();
    this.timeLastEnlapsed = Math.abs(this.timeLastSuccess - this.timeLastCall);
    this.timeEnlapsedAverage = (this.timeEnlapsedAverage * this.countSuccess + this.timeLastEnlapsed) / this.countSuccess + 1;
    this.countSuccess++;
  }

  fail(timePenalty = ProviderMetrics.FAIL_TIME_PENALTY) {}

}
ProviderMetrics.FAIL_TIME_PENALTY = 1000;
export class Provider {
  constructor() {
    this.metrics = new ProviderMetrics();
    this.dataGetResolvers = new Set();
  }

  notifyLocalSubs(key, value) {
    for (let _resolve of this.dataGetResolvers) {
      if (_resolve.key && _resolve.key === key) {
        _resolve(value);

        if (!_resolve.persist) this.dataGetResolvers.delete(_resolve);
      }
    }
  }

  setItem(key, value) {
    throw `not implemented`;
  }

  getItem(key) {
    var _this = this;

    return new Promise(async function (_resolve, _reject) {
      _this.metrics.start();

      let r = _resolve;
      r.key = key;
      r.persist = false;

      _this.dataGetResolvers.add(r);
    });
  }
  /**needs to be called from subclasses with super.onItem */


  onItem(key, r) {
    r.key = key;
    r.persist = true;
    this.dataGetResolvers.add(r);
  }

  offItem(r) {
    this.dataGetResolvers.delete(r);
  }

  on(type, cb) {}

}