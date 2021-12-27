import { Provider } from "../provider.js";
export class LocalStorageProvider extends Provider {
  constructor() {
    super();
    this.name = "localstorage";
  }

  getItem(key) {
    var _this = this;

    return new Promise(async function (_resolve, _reject) {
      _this.metrics.start();

      let result;

      try {
        result = localStorage.getItem(key);
      } catch (ex) {
        _this.metrics.fail();

        _reject(ex);

        return;
      }

      _this.metrics.end();

      _resolve(result);
    });
  }

  setItem(key, value) {
    var _this2 = this;

    return new Promise(async function (_resolve, _reject) {
      try {
        _this2.metrics.start();

        localStorage.setItem(key, value);

        _this2.metrics.end();
      } catch (ex) {
        _this2.metrics.fail();

        _reject(ex);

        return;
      }

      _this2.notifyLocalSubs(key, value);

      _resolve(true);
    });
  }

  onItem(key, r) {
    super.onItem(key, r);
  }

  offItem(r) {
    super.offItem(r);
  }

}