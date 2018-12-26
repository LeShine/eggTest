'use strict'

const Controller = require('egg').Controller

class NewsController extends Controller {
    async list() {

        let dataList = await this.service.news.list(this.ctx.query);
        // await this.ctx.render('news/list.tpl', dataList)
        this.ctx.body = dataList
        this.ctx.status = 200;
    }
}
module.exports = NewsController