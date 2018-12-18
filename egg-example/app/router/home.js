'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const {
    router,
    controller: {
      home: {
        index,
      },
    },

  } = app;
  router.get('/', index);
};
