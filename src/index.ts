
import {
  EXPONENT_CSS_BODY_STYLES,
  EXPONENT_CSS_STYLES,
  Input,
  Panel
} from "./node_modules/@repcomm/exponent-ts/docs/mod.js";
import { ddb } from "./mod.js";
import { LocalStorageProvider } from "./providers/localstorage.js";

EXPONENT_CSS_BODY_STYLES.mount(document.head);
EXPONENT_CSS_STYLES.mount(document.head);

async function main () {
  let container = new Panel()
  .setId("container")
  .mount(document.body);

  ddb.link({
    provider: new LocalStorageProvider()
  });

  ddb.on("connect", (evt)=>{

  });

  ddb.getItem("name").then((value)=>{
    console.log("got value of 'name'", value);
  });

  ddb.onItem("name", (value)=>{
    console.log("change 'name'", value);
  });

  const aInput = new Input()
  .mount(container)
  .on("keyup", (evt)=>{
    ddb.setItem("aInput", aInput.getValue());
  });

  ddb.onItem("aInput", (value)=>{
    // console.log("change 'name'", value);
    bInput.setValue(value);
  });

  const bInput = new Input()
  .mount(container)
  .on("change", (evt)=>{
    console.log("loop possible");
  });
}
main();
