'use strict';

module.exports = appInfo => {
  const config = exports = {};


  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_123456';
  // add your config here
  config.middleware = [];
  // 添加 view 配置
  config.view = {
    defaultViewEngine: 'nunjucks',
    defaultExtension: '.tpl',
    mapping: {
      '.tpl': 'nunjucks',
    }
  }

  return config;
};
