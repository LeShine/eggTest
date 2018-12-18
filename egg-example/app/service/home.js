'use strict'

const Service = require('egg').Service
class HomeService extends Service {
    async index() {
        let say = 'Hello'
        let key = this.config.keys
        for (let i = 0; i < 5; i++) {
            say += 'egg'
        }
        return { datas: say }
    }
}
module.exports = HomeService
