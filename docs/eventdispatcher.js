import { isUndefinedOrNull } from "./utils.js";
export class EventDispatcher {
  constructor() {
    this.listeners = {};
  }

  on(type, cb) {
    if (isUndefinedOrNull(this.listeners[type])) this.listeners[type] = new Set();
    this.listeners[type].add(cb);
    return this;
  }

  off(type, cb) {
    if (isUndefinedOrNull(this.listeners[type])) return this;
    this.listeners[type].delete(cb);
    return this;
  }

  fire(type, evt) {
    let listeners = this.listeners[type];
    if (isUndefinedOrNull(listeners)) return this;

    for (let cb of listeners) {
      cb(evt);
    }

    return this;
  }

}