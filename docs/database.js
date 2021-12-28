import { Datum } from "./datum.js";
import { EventDispatcher } from "./eventdispatcher.js";
import { Query } from "./query.js";
export class Database extends EventDispatcher {
  constructor() {
    super();
    this.global = new Datum(this, null, "global");

    this.dataEventHandler = evt => {
      switch (evt.type) {
        case "change":
          console.log("[db]", evt.datum.networkId, "aka", evt.datum.key, "value is", evt.datum.value);
          break;

        case "init":
          break;
      }
    };

    this.eventHandler = evt => {
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

  get(...ids) {
    return new Query(this.global).get(...ids);
  }

}