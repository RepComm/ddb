
import {
  EXPONENT_CSS_BODY_STYLES,
  EXPONENT_CSS_STYLES,
  Input,
  Panel
} from "../node_modules/@repcomm/exponent-ts/docs/mod.js";

import { Database, LocalStorageProvider, WebSocketProvider } from "./mod.js";

EXPONENT_CSS_BODY_STYLES.mount(document.head);
EXPONENT_CSS_STYLES.mount(document.head);

async function main() {
  let container = new Panel()
    .setId("container")
    .mount(document.body);

  let ddb = new Database();

  let pub = 3.14159.toString(16);
  
  ddb.get(pub).get("position").get("x").set("10");

  ddb.get(pub).get("position").get("x").on("change", ()=>{
    //
  });

  ddb.get(pub).get("position").publish();
  
  ddb[pub].position.x = 10;

  const aInput = new Input()
    .mount(container)
    .on("keyup", (evt) => {
      ddb.get("a-input").set(aInput.getValue());    
    });
  
  ddb.get("a-input").on("change", ()=>{
    
  });

  const bInput = new Input()
    .mount(container)
    .on("change", (evt) => {
      console.log("loop possible");
    });
}
main();
