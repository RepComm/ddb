
import { Datum, DataKey, DataValue, DataEventType, DataEventListener } from "./datum";

export type EmptyGetPolicy = "throw"|"create"|"error-prop";

export class Query {

  datum: Datum;
  emptyGetPolicy: EmptyGetPolicy;
  error: string;

  constructor (root: Datum) {
    this.reset(root);
    this.setEmptyGetPolicy("create");
  }
  value (): Datum {
    return this.datum;
  }
  setEmptyGetPolicy (p: EmptyGetPolicy): this {
    this.emptyGetPolicy = p;
    return this;
  }
  get (...ids: DataKey[]): this {
    for (let id of ids) {
      if (this.datum.hasChild(id)) {
        this.datum = this.datum.getChild(id);
      } else {
        this.error = `couldn't get child ${id} of ${this.datum}`;
        if (this.emptyGetPolicy === "create") {
          let child = this.datum.addChild(id);
          this.datum = child;
          this.error = undefined;
        } else if (this.emptyGetPolicy === "throw") {
          throw this.error;
        } else {

        }
      }
    }
    return this;
  }
  on (type: DataEventType, cb: DataEventListener) {
    this.datum.on(type, cb);
  }
  off (type: DataEventType, cb: DataEventListener) {
    this.datum.off(type, cb);
  }
  reset (root: Datum): this {
    this.datum = root;
    this.error = undefined;
    return this;
  }
  set (value: DataValue): this {
    this.datum.set(value);
    return this;
  }
}

