const _ = require('lodash');

class Collection {
  constructor(items, id) {
    this.lastId = id || 0;
    this.items = items || [];
  }

  async find(query) {
    return _.filter(this.items, query);
  }

  async create(data) {
    if (!data.id) {
      data.id = ++this.lastId;
    }

    this.items.push(data);

    return data;
  }

  async createMany(data) {
    return data.map(item => this.create(item));
  }

  async remove(query) {
    _.reject(this.items, query);
  }

  async update(query, data) {
    const item = this._find(query);
    Object.assign(item, data);

    return item;
  }

  async clear() {
    this.items = [];
  }
}

module.exports = Collection;
