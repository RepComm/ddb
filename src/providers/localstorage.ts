
import { DataResolver, Provider } from "../provider.js";

export class LocalStorageProvider extends Provider {
  name: "localstorage";
  
  constructor () {
    super();
    this.name = "localstorage";
  }
  getItem (key: string) {
    return new Promise<string>(async (_resolve, _reject) => {
      this.metrics.start();

      let result: string;
      try {
        result = localStorage.getItem(key);
      } catch (ex) {
        this.metrics.fail();
        _reject(ex);
        return;
      }
      this.metrics.end();
      _resolve(result);
    });
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
      this.notifyLocalSubs(key, value);
      _resolve(true);
    });
  }
  onItem (key: string, r: DataResolver) {
    super.onItem(key, r);
  }
  offItem (r: DataResolver) {
    super.offItem(r);
  }
}

