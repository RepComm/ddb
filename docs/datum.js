import { EventDispatcher } from "./eventdispatcher.js";
import { isUndefinedOrNull } from "./utils.js";
export class Datum extends EventDispatcher {
  constructor(db) {
    super();
    this.db = db;
    this.db.fire("add", {
      type: "add",
      datum: this
    });
  }

  hasChild(id) {
    if (isUndefinedOrNull(id)) throw "Cannot check if hasChild: id provided was undefined or null!";
    return !isUndefinedOrNull(this.children) && !isUndefinedOrNull(this.getChild(id));
  }

  getChild(id) {
    return this.children[id];
  }

  addChild(id) {
    let result = new Datum(this.db);
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