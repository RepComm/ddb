
import { DataEvent, DataEventListener, DataKey, Datum } from "./datum.js";
import { BaseEvtListener, EventDispatcher } from "./eventdispatcher.js";
import { Query } from "./query.js";

export type DatabaseEventType = "add"|"delete";

export interface DatabaseEvent {
  type: DatabaseEventType;
  datum: Datum;
}

export interface DatabaseEventListener extends BaseEvtListener<DatabaseEvent> {
  (evt: DatabaseEvent): void;
}

export class Database extends EventDispatcher<DatabaseEventType, DatabaseEvent, DatabaseEventListener> {
  global: Datum;

  eventHandler: DatabaseEventListener;
  dataEventHandler: DataEventListener;

  constructor () {
    super();

    this.global = new Datum(this);

    this.dataEventHandler = (evt: DataEvent) => {
      switch (evt.type) {
        case "change":
          console.log("db detect data change", evt.datum);
          break;
        case "init":
          break;
      }
    };

    this.eventHandler = (evt: DatabaseEvent)=>{
      switch (evt.type) {
        case "add":
          // console.log("datum added", evt.datum);
          evt.datum.on("change", this.dataEventHandler);
          evt.datum.on("init", this.dataEventHandler);
          break;
        case "delete":
          break;
      }
    };

    this.on("add", this.eventHandler);
    this.on("delete", this.eventHandler);
  }
  get (...ids: DataKey[]): Query {
    return new Query(this.global).get(...ids);
  }
}
