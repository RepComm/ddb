
import { DataResolver, Provider } from "./provider.js";

export type DDBEventType = "connect" | "disconnect" | "set" | "pub" | "sub" | "unsub";

export interface DDBListener {
  type?: DDBEventType;
  (evt: DDBEvent): void;
}

export interface DDBEvent {
  type: DDBEventType;
  disconnect?: Provider;
  key?: DDBEventKey;
}

export type DDBEventKey = string;
export type DDBEventValue = string;

export interface DDBEventConnect extends DDBEvent {
  type: "connect";
  provider?: Provider;
}
export interface DDBEventDisconnect extends DDBEvent {
  type: "disconnect";
  provider?: Provider;
}
export interface DDBEventSet extends DDBEvent {
  value: DDBEventValue;
}
export interface DDBEventSub extends DDBEvent {
  type: "sub";
}
export interface DDBEventUnSub extends DDBEvent {
  type: "unsub";
}

export interface DDBData {
  [key: DDBEventKey]: DDBEventType;
}

export interface LinkOptions {
  provider: Provider;
}

export const ddb = {
  providers: new Array<Provider>(),

  listeners: new Set<DDBListener>(),

  on(type: DDBEventType, cb: DDBListener) {
    cb.type = type;
    ddb.listeners.add(cb);
  },
  off(cb: DDBListener) {
    ddb.listeners.delete(cb);
  },
  fire(evt: DDBEvent) {
    for (let listener of ddb.listeners) {
      if (listener.type === evt.type) {
        setTimeout(() => { listener(evt) }, 1);
      }
    }
  },
  link(opts: LinkOptions) {
    if (ddb.providers.includes(opts.provider)) {
      throw `cannot link twice, this provider is already linked.`;
    }
    ddb.providers.push(opts.provider);
    if (opts.provider.on) {
      opts.provider.on("connect", () => {
  
      });
    }
  },
  getItem (key: string): Promise<string> {
    return new Promise(async (_resolve, _reject) => {
      let result: string;

      for (let provider of ddb.providers) {
        try {
          result = await provider.getItem(key);
        } catch (ex) {
          continue;
        }
        _resolve(result);
        return;
      }
    });
  },
  onItem (key: string, r: DataResolver) {
    for (let p of ddb.providers) {
      p.onItem(key, r);
    }  
  },
  offItem (r: DataResolver) {
    for (let p of ddb.providers) {
      p.offItem(r);
    }
  },
  sortProviders (): Promise<void> {
    return new Promise(async (_resolve, _reject)=>{
      ddb.providers.sort((a, b)=>{
        return a.metrics.timeEnlapsedAverage - b.metrics.timeEnlapsedAverage;
      });
    });
  },
  setItem (key: string, value: string): Promise<boolean> {
    return new Promise(async (_resolve, _reject) => {
      let result = false;
      for (let provider of ddb.providers) {
        if (await provider.setItem(key, value)) {
          result = true;
          break;
        }
      }
      ddb.sortProviders();
      _resolve(result);
    })
  }
};
