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
  }

}