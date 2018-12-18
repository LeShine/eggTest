'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    // this.ctx.body = 'hi, egg';
    this.ctx.body = await this.service.home.index(this.ctx.query);
    this.ctx.status = 200;
  }
}

module.exports = HomeController;
