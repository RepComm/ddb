
import { DDBEvent, DDBEventType, DDBListener } from "./mod.js";

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


export interface DataResolver {
  (value: string): void;
  key?: string;
  persist?: boolean;
}

export class Provider {
  
  metrics: ProviderMetrics;

  name: string;

  dataGetResolvers: Set<DataResolver>;

  constructor () {
    this.metrics = new ProviderMetrics();
    this.dataGetResolvers = new Set();
  }
  notifyLocalSubs (key: string, value: string) {
    for (let _resolve of this.dataGetResolvers) {
      if (_resolve.key && _resolve.key === key) {
        _resolve(value);
        if (!_resolve.persist) this.dataGetResolvers.delete(_resolve);
      }
    }
  }

  setItem(key: string, value: string): Promise<boolean> {
    throw `not implemented`;
  }
  getItem(key: string): Promise<string> {
    return new Promise<string>(async (_resolve, _reject) => {
      this.metrics.start();

      let r: DataResolver = _resolve as any;
      r.key = key;
      r.persist = false;
      this.dataGetResolvers.add(r);
    });
  }
  /**needs to be called from subclasses with super.onItem */
  onItem (key: string, r: DataResolver) {
    r.key = key;
    r.persist = true;
    this.dataGetResolvers.add(r);
  }
  offItem (r: DataResolver) {
    this.dataGetResolvers.delete(r);
  }
  on?(type: DDBEventType, cb: DDBListener): void {

  }
}
