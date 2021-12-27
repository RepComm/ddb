
import { EventDispatcher } from "./eventdispatcher.js";
import { isUndefinedOrNull } from "./utils.js";

export type UUID = string;

export type DataKey = string;
export type DataValue = string | Array<string>;


export interface DatumMap {
  [key: DataKey]: Datum;
}

export type DataEventType = "init"|"change";

export interface DataEvent {
  
}

export interface DataEventListener {
  (evt: DataEvent): void;
}

export class Datum extends EventDispatcher<DataEventType, DataEvent, DataEventListener> {
  uuid: UUID;
  value: DataValue;
  children: DatumMap;

  constructor() {
    super();

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
    let result = new Datum();
    if (isUndefinedOrNull(this.children)) this.children = {};
    this.children[id] = result;
    return result;
  }
  set(v: DataValue): this {
    this.value = v;

    if ( isUndefinedOrNull(v)) {
      this.fire("init");
    } else {
      this.fire("change");
    }
    return this;
  }
}

async function test () {
  let d = new Datum()
  
  .on("init", ()=>{
    console.log("init data to", d.value);
  })

  .on("change", ()=>{
    console.log("change data to", d.value);
  });

  d.set("hello world");
  d.set("hello world 2");
}
