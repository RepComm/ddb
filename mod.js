export const ddb = {
  providers: new Array(),
  listeners: new Set(),

  on(type, cb) {
    cb.type = type;
    ddb.listeners.add(cb);
  },

  off(cb) {
    ddb.listeners.delete(cb);
  },

  fire(evt) {
    for (let listener of ddb.listeners) {
      if (listener.type === evt.type) {
        setTimeout(() => {
          listener(evt);
        }, 1);
      }
    }
  },

  link(opts) {
    if (ddb.providers.includes(opts.provider)) {
      throw `cannot link twice, this provider is already linked.`;
    }

    ddb.providers.push(opts.provider);

    if (opts.provider.on) {
      opts.provider.on("connect", () => {});
    }
  },

  getItem(key) {
    return new Promise(async (_resolve, _reject) => {
      let result;

      for (let provider of ddb.providers) {
        try {
          result = await provider.getItem(key);
        } catch (ex) {
          continue;
        }

        _resolve(result);

        return;
      }
    });
  },

  onItem(key, r) {
    for (let p of ddb.providers) {
      p.onItem(key, r);
    }
  },

  offItem(r) {
    for (let p of ddb.providers) {
      p.offItem(r);
    }
  },

  sortProviders() {
    return new Promise(async (_resolve, _reject) => {
      ddb.providers.sort((a, b) => {
        return a.metrics.timeEnlapsedAverage - b.metrics.timeEnlapsedAverage;
      });
    });
  },

  setItem(key, value) {
    return new Promise(async (_resolve, _reject) => {
      let result = false;

      for (let provider of ddb.providers) {
        if (await provider.setItem(key, value)) {
          result = true;
          break;
        }
      }

      ddb.sortProviders();

      _resolve(result);
    });
  }

};