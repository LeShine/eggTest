'use strict'

const Service = require('egg').Service
const WXBizDataCrypt = require('../public/WXBizDataCrypt')
class HomeService extends Service {
    async index() {
        let say = 'Hello'
        let arr = ['1','2','3']
        let arr2 = arr.map(parseInt)
        console.log(arr2)
        let key = this.config.keys
        for (let i = 0; i < 5; i++) {
            say += 'egg'
        }
        return { datas: say }
    }

    //小程序授权登录信息获取
    async getUserInfo(body) {
        let AppID = this.config.AppID
        let AppSecret = this.config.AppSecret
        let { code, iv, rawData, signature, encryptedData } = body
        let url = 'https://api.weixin.qq.com/sns/jscode2session'
        let getOpenidInfo = await getOpenid(url)
        let pc = new WXBizDataCrypt(AppID, getOpenidInfo.session_key)
        let data = pc.decryptData(encryptedData, iv)
        console.log('解密后 data: ', data)
        
        //?grant_type=client_credential&appid=APPID&secret=APPSECRET'
        // ?access_token=ACCESS_TOKEN
        let assTUrl = 'https://api.weixin.qq.com/cgi-bin/token'
        let sendMsgUrl = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send'
        let access_token = await getAccess_token(assTUrl)
        await sendMsg(sendMsgUrl)

        return data
        function getOpenid(url) {
            return new Promise(function (resolve) {
                axios
                    .get(url, {
                        params: {
                            appid: AppID,
                            secret: AppSecret,
                            js_code: code,
                            grant_type: 'authorization_code'
                        }
                    })
                    .then(response => response.data)
                    .then(function (data) {
                        resolve(data)
                    })
            })
        }


        function getAccess_token(url) {
            return new Promise(function (resolve) {
                axios
                    .get(url, {
                        params: {
                            appid: AppID,
                            secret: AppSecret,
                            grant_type: 'client_credential'
                        }
                    })
                    .then(response => response.data)
                    .then(function (data) {
                        resolve(data)
                    })
            })
        }

        function sendMsg(url) {
            return new Promise(function (resolve) {
                axios
                    .get(url, {
                        params: {
                            access_token: access_token,
                        }
                    })
                    .then(response => response.data)
                    .then(function (data) {
                        resolve(data)
                    })
            })
        }
    }

}
module.exports = HomeService
