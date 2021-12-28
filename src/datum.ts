
import { Database } from "./database.js";
import { EventDispatcher } from "./eventdispatcher.js";
import { isUndefinedOrNull } from "./utils.js";
import { murmurhash3 } from "./murmur.js";

export type NetworkId = number;

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
  networkId: NetworkId;
  value: DataValue;
  children: DatumMap;
  db: Database;
  parent: Datum;
  key: DataKey;
  cachedFullKey: string;

  constructor(db: Database, parent: Datum, key: string) {
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
  get fullKey (): string {
    if (isUndefinedOrNull(this.cachedFullKey)) this.cachedFullKey = this.calcFullKey();
    return this.cachedFullKey;
  }
  private calcFullKey (): string {
    if (isUndefinedOrNull( this.parent) ) {
      return this.key;
    } else {
      return this.parent.fullKey + this.key;
    }
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
    let result = new Datum(this.db, this, id);
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
