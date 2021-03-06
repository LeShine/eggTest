'use strict'
const Service = require('egg').Service

class NewsService extends Service {
    async list() {
        const pageSize = 5
        const serverUrl = 'https://hacker-news.firebaseio.com/v0'
        const page = 1;
        const newsList = {
            lists: [
                { id: 1, title: 'this is news 1', url: '/news/1' },
                { id: 2, title: 'this is news 2', url: '/news/2' }
            ]
        }

        return newsList
    }
}
module.exports = NewsService