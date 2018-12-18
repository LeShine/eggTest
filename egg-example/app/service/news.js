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
        // const { data: idList } = await this.ctx.curl(`${serverUrl}/topstories.json`, {
        //     data: {
        //         orderBy: '"$key"',
        //         startAt: `"${pageSize * (page - 1)}"`,
        //         endAt: `"${pageSize * page - 1}"`,
        //     },
        //     dataType: 'json',
        // })

        // const newsList = await Promise.all(
        //     Object.keys(idList).map(key => {
        //         const url = `${serverUrl}/item/${idList[key]}.json`;
        //         return this.ctx.curl(url, { dataType: 'json' });
        //     })
        // )newsList.map(res => res.data);

        return newsList
    }
}
module.exports = NewsService