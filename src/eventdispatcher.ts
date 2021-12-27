
import { isUndefinedOrNull } from "./utils.js";

export interface BaseEvtListener<Evt> {
  (evt?: Evt): void;
}

export type EvtListenerMap<EvtType extends string, Evt, EvtListener extends BaseEvtListener<Evt>> = {
  [key in EvtType]?: Set<EvtListener>;
};

export class EventDispatcher<EvtType extends string, Evt, EvtListener extends BaseEvtListener<Evt>> {
  listeners: EvtListenerMap<EvtType, Evt, EvtListener>;

  constructor () {
    this.listeners = {};
  }
  on (type: EvtType, cb: EvtListener): this {
    if (isUndefinedOrNull( this.listeners[type]) ) this.listeners[type] = new Set();
    this.listeners[type].add(cb);
    return this;
  }
  off (type: EvtType, cb: EvtListener): this {
    if (isUndefinedOrNull( this.listeners[type]) ) return this;
    this.listeners[type].delete(cb);
    return this;
  }
  fire (type: EvtType, evt?: Evt): this {
    let listeners = this.listeners[type];
    if (isUndefinedOrNull(listeners)) return this;
    for (let cb of listeners) {
      cb(evt);
    }
    return this;
  }
}
