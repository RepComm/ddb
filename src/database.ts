
import { DataKey, Datum } from "./datum";
import { Query } from "./query";

export class Database {
  global: Datum;

  constructor () {
    this.global = new Datum();

  }
  get (...ids: DataKey[]): Query {
    return new Query(this.global).get(...ids);
  }
}
