
import { DDBEvent, DDBEventSet, DDBEventSub, DDBEventUnSub } from "../mod.js";
import { DataResolver, Provider } from "../provider.js";

export class WebSocketProvider extends Provider {
  name: "ws";
  ws: WebSocket;

  constructor (address: string) {
    super();

    this.name = "ws";
    this.ws = new WebSocket(address);
    this.ws.addEventListener("open", (evt)=>{

    });
    this.ws.addEventListener("message", (evt)=>{
      let msg: DDBEvent;
      try {
        msg = JSON.parse(evt.data);
      } catch (ex) {
        console.warn("couldn't parse ws message as json");
        return;
      }
      switch(msg.type) {
        case "set":
          let m = msg as DDBEventSet;
          this.notifyLocalSubs(m.key, m.value);
          break;
        case "pub":

          break;
        case "unsub":
          break;
      }
      
    });
  }
  onItem (key: string, r: DataResolver) {
    super.onItem(key, r);
    
    let subscribeMsg: DDBEventSub = {
      type: "sub",
      key: key
    };
    try {
      this.ws.send(JSON.stringify(subscribeMsg));
    } catch (ex) {
      console.error(`couldn't subscribe on websocket provider: ${ex}`);
    }
  }
  offItem (r: DataResolver) {
    super.offItem(r);
    
    let unsubscribeMsg: DDBEventUnSub = {
      type: "unsub",
      key: r.key
    };
    try {
      this.ws.send(JSON.stringify(unsubscribeMsg));
    } catch (ex) {
      console.error(`couldn't unsubscribe on websocket provider: ${ex}`);
    }
  }
  setItem (key: string, value: string) {
    return new Promise<boolean>(async (_resolve, _reject) => {
      try {
        this.metrics.start();
        localStorage.setItem(key, value);
        this.metrics.end();
      } catch (ex) {
        this.metrics.fail();
        _reject(ex);
        return;
      }
      _resolve(true);
    });
  }
}

