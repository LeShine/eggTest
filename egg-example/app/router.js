'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
const fs = require('fs')
const path = require('path')
module.exports = app => {

    let routerDir = path.join(__dirname, './router')
    let files = fs.readdirSync(routerDir)
    files.forEach(file => {
        require(path.join(routerDir, file))(app)
    })

    // const {
    //     router,
    //     controller: {
    //         home: {
    //             index,
    //         },
    //         news:{
    //             list
    //         }
    //     }

    // } = app;
    // router.get('/', index);
    // router.get('/news', list);
};
