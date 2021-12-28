export class Query {
  constructor(root) {
    this.reset(root);
    this.setEmptyGetPolicy("create");
  }

  value() {
    return this.datum;
  }

  setEmptyGetPolicy(p) {
    this.emptyGetPolicy = p;
    return this;
  }

  get(...ids) {
    for (let id of ids) {
      if (this.datum.hasChild(id)) {
        this.datum = this.datum.getChild(id);
      } else {
        this.error = `couldn't get child ${id} of ${this.datum}`;

        if (this.emptyGetPolicy === "create") {
          let child = this.datum.addChild(id);
          this.datum = child;
          this.error = undefined;
        } else if (this.emptyGetPolicy === "throw") {
          throw this.error;
        } else {}
      }
    }

    return this;
  }

  on(type, cb) {
    this.datum.on(type, cb);
  }

  off(type, cb) {
    this.datum.off(type, cb);
  }

  reset(root) {
    this.datum = root;
    this.error = undefined;
    return this;
  }

  set(value) {
    this.datum.set(value);
    return this;
  }

  publish() {
    this.published = true;
    return this;
  }

  unpublish() {
    this.published = false;
    return this;
  }

}