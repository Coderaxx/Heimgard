'use strict';

const Homey = require('homey');

class Heimgard extends Homey.App {

  async onInit() {
    this.log('Heimgard has been initialized');
  }

}

module.exports = Heimgard;
