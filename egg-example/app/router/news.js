module.exports = app => {
    const {
        router,
        controller: {
            news: {
                list,
            },
        },
    } = app
    router.get('/news', list)
}