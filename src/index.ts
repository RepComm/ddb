
import {
  EXPONENT_CSS_BODY_STYLES,
  EXPONENT_CSS_STYLES,
  Input,
  Panel
} from "../node_modules/@repcomm/exponent-ts/docs/mod.js";

import { Database } from "./mod.js";

EXPONENT_CSS_BODY_STYLES.mount(document.head);
EXPONENT_CSS_STYLES.mount(document.head);

async function main() {
  let container = new Panel()
    .setId("container")
    .mount(document.body);

  let ddb = new Database();

  const keyPair = await crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256"
    },
    true,
    ["encrypt", "decrypt"]
  );
  const publicKey = await crypto.subtle.exportKey("jwk", keyPair.publicKey);
  const privateKey = await crypto.subtle.exportKey("jwk", keyPair.privateKey);

  console.log(publicKey, privateKey);

  const aInput = new Input()
    .mount(container)
    .on("keyup", (evt) => {
      ddb.get("a-input").set(aInput.getValue());    
    });
  
  ddb.get("a-input").on("change", (evt)=>{
    bInput.setValue(evt.datum.value as string);
  });

  const bInput = new Input()
    .mount(container)
    .on("change", (evt) => {
      console.log("loop possible");
    });
}
main();
