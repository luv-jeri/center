const catcher = require('../utils/catcher');
const Features = require('./features.handler');

class CRUD {
  constructor(Model) {
    this.Model = Model;
  }
}

module.exports = CRUD;
