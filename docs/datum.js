import { EventDispatcher } from "./eventdispatcher.js";
import { isUndefinedOrNull } from "./utils.js";
import { murmurhash3 } from "./murmur.js";
export class Datum extends EventDispatcher {
  constructor(db, parent, key) {
    super();
    this.db = db;
    this.parent = parent;
    this.key = key;
    this.networkId = murmurhash3(this.fullKey, 0);
    this.db.fire("add", {
      type: "add",
      datum: this
    });
  }
  /**
   * 
   */


  get fullKey() {
    if (isUndefinedOrNull(this.cachedFullKey)) this.cachedFullKey = this.calcFullKey();
    return this.cachedFullKey;
  }

  calcFullKey() {
    if (isUndefinedOrNull(this.parent)) {
      return this.key;
    } else {
      return this.parent.fullKey + this.key;
    }
  }

  hasChild(id) {
    if (isUndefinedOrNull(id)) throw "Cannot check if hasChild: id provided was undefined or null!";
    return !isUndefinedOrNull(this.children) && !isUndefinedOrNull(this.getChild(id));
  }

  getChild(id) {
    return this.children[id];
  }

  addChild(id) {
    let result = new Datum(this.db, this, id);
    if (isUndefinedOrNull(this.children)) this.children = {};
    this.children[id] = result;
    return result;
  }

  set(v) {
    this.value = v;

    if (isUndefinedOrNull(v)) {
      this.fire("init", {
        type: "init",
        datum: this
      });
    } else {
      this.fire("change", {
        type: "change",
        datum: this
      });
    }

    return this;
  }

}