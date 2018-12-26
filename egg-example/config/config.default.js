'use strict';
/**
 * 省高投
 * https://cy.scgfchina.com/home
 * 小创
 * https://yq.veilytech.com/home
 * https://yqtest2.veilytech.com/home
 * 13555555555  88888888
 * what we have now is only tip of the iceberg
 */
module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_123456';
  // add your config here
  config.middleware = [];
  //
  config.AppID = 'wxb78c224739573ce4'
  config.AppSecret = '1a9d047f7c39ddbe8971fd9923c06ffe' 
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
