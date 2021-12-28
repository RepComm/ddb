
export class ProviderMetrics {
  static FAIL_TIME_PENALTY: number;
  timeLastCall: number;
  timeLastSuccess: number;
  timeLastEnlapsed: number;
  timeEnlapsedAverage: number;
  countSuccess: number;

  constructor () {
    this.timeLastCall = 0;
    this.timeLastEnlapsed = 0;
    this.timeLastSuccess = 0;
    this.countSuccess = 0;
  }
  start () {
    this.timeLastCall = Date.now();
  }
  end () {
    this.timeLastSuccess = Date.now();
    this.timeLastEnlapsed = Math.abs(this.timeLastSuccess - this.timeLastCall);
    
    this.timeEnlapsedAverage = (
      (this.timeEnlapsedAverage * this.countSuccess) +
      this.timeLastEnlapsed
    ) / this.countSuccess+1;

    this.countSuccess ++;
  }
  fail (timePenalty: number = ProviderMetrics.FAIL_TIME_PENALTY) {

  }
}
ProviderMetrics.FAIL_TIME_PENALTY = 1000;

export class Provider {
  
  metrics: ProviderMetrics;

  name: string;

  constructor () {
    this.metrics = new ProviderMetrics();
  }
}

export interface ProviderConfig {
  name: string;
  enabled: boolean;
}
