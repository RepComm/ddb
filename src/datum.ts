
import { Database } from "./database.js";
import { EventDispatcher } from "./eventdispatcher.js";
import { isUndefinedOrNull } from "./utils.js";

export type UUID = string;

export type DataKey = string;
export type DataValue = string | Array<string>;


export interface DatumMap {
  [key: DataKey]: Datum;
}

export type DataEventType = "init" | "change";

export interface DataEvent {
  type: DataEventType;
  datum: Datum;
}

export interface DataEventListener {
  (evt: DataEvent): void;
}

export class Datum extends EventDispatcher<DataEventType, DataEvent, DataEventListener> {
  uuid: UUID;
  value: DataValue;
  children: DatumMap;
  db: Database;

  constructor(db: Database) {
    super();
    this.db = db;
    this.db.fire("add", {
      type: "add",
      datum: this
    });
  }
  hasChild(id: string): boolean {
    if (isUndefinedOrNull(id)) throw "Cannot check if hasChild: id provided was undefined or null!";
    return (
      !isUndefinedOrNull(this.children) &&
      !isUndefinedOrNull(this.getChild(id))
    );
  }
  getChild(id: string): Datum {
    return this.children[id];
  }
  addChild(id: string): Datum {
    let result = new Datum(this.db);
    if (isUndefinedOrNull(this.children)) this.children = {};
    this.children[id] = result;
    return result;
  }
  set(v: DataValue): this {
    this.value = v;

    if (isUndefinedOrNull(v)) {
      this.fire("init", { type: "init", datum: this });
    } else {
      this.fire("change", { type: "change", datum: this });
    }
    return this;
  }
}
