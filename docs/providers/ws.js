import { Provider } from "../provider.js";
export class WebSocketProvider extends Provider {
  constructor(address) {
    super();
    this.name = "ws";
    this.ws = new WebSocket(address);
    this.ws.addEventListener("open", evt => {});
    this.ws.addEventListener("message", evt => {
      let msg;

      try {
        msg = JSON.parse(evt.data);
      } catch (ex) {
        console.warn("couldn't parse ws message as json");
        return;
      }

      switch (msg.type) {
        case "set":
          let m = msg;
          this.notifyLocalSubs(m.key, m.value);
          break;

        case "pub":
          break;

        case "unsub":
          break;
      }
    });
  }

  onItem(key, r) {
    super.onItem(key, r);
    let subscribeMsg = {
      type: "sub",
      key: key
    };

    try {
      this.ws.send(JSON.stringify(subscribeMsg));
    } catch (ex) {
      console.error(`couldn't subscribe on websocket provider: ${ex}`);
    }
  }

  offItem(r) {
    super.offItem(r);
    let unsubscribeMsg = {
      type: "unsub",
      key: r.key
    };

    try {
      this.ws.send(JSON.stringify(unsubscribeMsg));
    } catch (ex) {
      console.error(`couldn't unsubscribe on websocket provider: ${ex}`);
    }
  }

  setItem(key, value) {
    var _this = this;

    return new Promise(async function (_resolve, _reject) {
      try {
        _this.metrics.start();

        localStorage.setItem(key, value);

        _this.metrics.end();
      } catch (ex) {
        _this.metrics.fail();

        _reject(ex);

        return;
      }

      _resolve(true);
    });
  }

}