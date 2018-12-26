const crypto = require('crypto')
const util = require('util')
const iterations = 10
const pbkdf2 = util.promisify(crypto.pbkdf2)
const commonCode = require('../../../common/commonCode')
/**
 * @constructor MyError
 * @param {string} message
 */
function MyError(message) {
    this.name = 'MyError'
    this.stack = new Error().stack
    this.code = message.code
    this.msg = message.msg
}
MyError.prototype = Object.create(Error.prototype)
MyError.prototype.constructor = MyError

module.exports = {
    serverAgreementField: ['营业执照', '服务合同'],
    ERROR: {
        code: 1,
        msg: 'failed'
    },
    SUCCESS: {
        code: 200,
        msg: 'success'
    },
    async upsertTag({ tags, park_id, flag, TagCount, addOrUpdate }) {
        if (!tags) return
        tags = tags.split(';').map(v => v.replace(/(^\(|\)$)/g, ''))
        await Promise.all(
            tags.map(async tagName => {
                let instance = await TagCount.findOne({
                    where: {
                        isValid: 1,
                        tagName,
                        park_id,
                        flag
                    }
                })
                if (addOrUpdate === 1) {
                    if (!instance) {
                        await TagCount.create({
                            tagName,
                            park_id,
                            flag,
                            count: 1
                        })
                    } else {
                        instance.count++
                        await instance.save()
                    }
                } else if (addOrUpdate === 0) {
                    if (instance) {
                        if (instance.count >= 1) {
                            instance.count--
                            await instance.save()
                        }
                    }
                }
            })
        )
    },

    //政策
    async updatePolicyTag({
        area_id,
        Op,
        Area,
        AreaPark,
        Park,
        oldTags,
        newTags,
        TagCount,
        addOrUpdate
    }) {
        let area_ids = await Area.findAll({
            where: {
                isValid: 1
                // area_id: {
                //     [Op.gt]: area_id
                // }
            },
            attributes: ['area_id', 'father_id', 'root_id'],
            raw: true
        })
        // area_ids.sort((x, y) => x.area_id - y.area_id)
        let set = new Set()
        set.add(area_id)
        let findChild = father_id => {
            // let childs=[]
            area_ids.forEach(v => {
                if (v.father_id === father_id && !set.has(v.area_id)) {
                    set.add(v.area_id)
                    findChild(v.area_id)
                }
            })
        }
        findChild(area_id)
        let childArea = [...set]
        let areaParks = await AreaPark.findAll({
            where: {
                isValid: 1,
                area_id: {
                    [Op.in]: childArea
                }
            },
            include: [
                {
                    model: Park,
                    where: {
                        isValid: 1
                    }
                }
            ],
            attributes: ['park_id']
        })
        let park_ids = new Set()
        areaParks.forEach(v => {
            v = v.get({
                plain: true
            })
            park_ids.add(v.park_id)
        })
        park_ids = [...park_ids]
        const flag = 4
        // let { tags } = policy
        await Promise.all(
            park_ids.map(async park_id => {
                if (Number.isInteger(addOrUpdate)) {
                    await module.exports.upsertTag({
                        tags: oldTags,
                        park_id,
                        flag,
                        TagCount,
                        addOrUpdate
                    })
                } else {
                    await module.exports.upsertTag({
                        tags: oldTags,
                        park_id,
                        flag,
                        TagCount,
                        addOrUpdate: 0
                    })
                    await module.exports.upsertTag({
                        tags: newTags,
                        park_id,
                        flag,
                        TagCount,
                        addOrUpdate: 1
                    })
                }
            })
        )
    },
    /**获取最多的前20个标签 */
    async getTag({ flag, park_id, TagCount, Op }) {
        let tags = await TagCount.findAll({
            where: {
                flag,
                park_id,
                count: {
                    [Op.gt]: 0
                }
            },
            order: [['count', 'desc']],
            attributes: ['tagName'],
            limit: 20
        })
        return tags.map(v => v.tagName)
    },
    routerMapAction: {
        user: {
            '/api/user/register': '增加用户',
            '/api/user/updateUser': '修改用户信息',
            '/api/user/deleteUser': '删除用户',
            '/api/user/addrole': '添加角色',
            '/api/user/deleteRole': '删除角色',
            '/api/user/modifyPassword': '修改密码',
            '/api/user/resetPassword': '重置密码',
            '/api/user/setRolePermission': '设置角色权限',
            '/api/user/setrole': '修改角色名',
            '/api/user/processConfigDatas': '修改基础配置'
        },
        company: {
            '/api/company/addCompany': '增加企业',
            '/api/company/processCompanyFilesList': '修改企业资料',
            '/api/company/processCompanyIntelRight': '修改知识产权',
            '/api/company/processCompanyOperation': '修改经营信息',
            '/api/company/processCompanyPatent': '修改专利信息',
            '/api/company/processCompanyNeed': '修改企业需求',
            '/api/company/processCompanyFinancing': '修改融资信息',
            '/api/company/addCompanyNews': '添加企业新闻',
            '/api/company/updateCompanyNews': '修改企业新闻',
            '/api/company/processCompanyTalentStat': '修改人才统计信息',
            '/api/company/sureOneChange': '确认单条新数据',
            '/api/company/sureAllChange': '确认多条新数据'
        },
        park: {
            '/api/park/addCompanyNews': '增加企业新闻',
            '/api/park/updateCompanyNews': '修改企业新闻',
            '/api/park/deleteCompanyNews': '删除企业新闻',
            '/api/park/addParkNews': '增加园区新闻',
            '/api/park/updateParkNews': '修改园区新闻',
            '/api/park/deleteParkNews': '删除园区新闻',
            '/api/park/updateParkCountOneYear': '更新园区统计',
            '/api/park/saveQuickEntrys': '保存快速入口'
        },
        product: {
            '/api/product/addProduct': '增加产品'
        },
        questionnaire: {
            '/api/questionnaire/addQuesMould': '增加模板',
            '/api/questionnaire/deleteQuesMould': '删除模板',
            '/api/questionnaire/updateOneQuesMould': '更新模板',
            '/api/questionnaire/addAnswerMould': '增加问卷',
            '/api/questionnaire/deleteAnswerMould': '删除问卷',
            '/api/questionnaire/updateOneAnswerMould': '更新问卷',
            '/api/questionnaire/copyAnswerMould': '复制问卷',
            '/api/questionnaire/changeAnswerMould': '修改问卷',
            /**进入问卷和增加答卷不需要登陆，所以日志获取不到用户信息 */
            // '/api/questionnaire/intoAnswer': '进入问卷',
            // '/api/questionnaire/addAnswer': '增加答卷',
            '/api/questionnaire/checkAnswer': '审核答卷'
        },
        serverOrg: {
            '/api/serverOrg/addServerOrg': '增加服务机构',
            '/api/serverOrg/processConfigDatas': '修改基本信息',
            '/api/serverOrg/processAgreementDatas': '修改服务协议',
            '/api/serverOrg/processSuccessfulCaseDatas': '修改成功案例'
        },
        talent: {
            '/api/talent/processTalent': '修改人才信息'
        },
        upload: {
            'api/upload/': '上传文件'
        }
    },
    FormatTime: (start, end) => {
        start = new Date(parseInt(start) || 0)
        end = new Date(parseInt(end) || 9998888800000)
        return [start, end]
    },
    FormatTimeYMD: (date) => {
        if (date) {
            date = new Date(date)
            let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
            let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
            return date.getFullYear() + '-' + month + '-' + day
        }
    },
    FormatTimeYMDHM: (date) => {
        if (date) {
            date = new Date(date)
            let month = date.getMonth() + 1 < 10 ? '0' + date.getMonth() + 1 : date.getMonth() + 1
            let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
            let hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
            let minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
            return date.getFullYear() + '-' + month + '-' + day + ' ' + hours + ':' + minute
        } else {
            return ''
        }
    },
    Schema(obj, keys) {
        for (const key of keys) {
            if (!obj[key] && obj[key] !== false && obj[key] !== 0) {
                return false
            }
        }
        return true
    },
    SchemaTrue(obj, keys) {
        for (const key of keys) {
            if (obj[key]) {
                return true
            }
        }
        return false
    },
    SchemaKey(obj, keys) {
        for (const key of keys) {
            if (!obj[key]) {
                return false
            }
        }
        return true
    },
    SchemaPromise(obj, keys) {
        for (const key of keys) {
            if (!obj[key] && obj[key] !== false && obj[key] !== 0 && obj[key] !== null) {
                return Promise.reject(
                    new MyError({
                        ...commonCode.parameterError,
                        msg: `${key}字段缺失或格式不对`
                    })
                )
            }
        }
    },
    async findOrCreate({ model, options, createdFn, notCreatedFn }) {
        return new Promise((resolve, reject) => {
            model
                .findOrCreate({
                    where: {
                        ...options,
                        isValid: 1
                    },
                    raw: true
                })
                .spread((area, created) => {
                    if (!created) {
                        resolve(notCreatedFn())
                    } else {
                        resolve(createdFn(area))
                    }
                })
        })
    },
    async hashPassword(password) {
        password = String(password)
        // password=new Buffer(password, 'binary')
        var salt = crypto
            .randomBytes(64)
            .toString('base64')
            .slice(0, 64)
        console.log('salt', salt.length)
        // var hash = pbkdf2(password, salt, iterations);

        let hash = await pbkdf2(password, salt, iterations, 64, 'sha256')
        hash = hash.toString('hex')
        console.log('hash', hash)
        // crypto.pbkdf2(password, salt, 1000, 64, 'sha512', (err, derivedKey) => {
        //   if (err) throw err;
        //   console.log(derivedKey.toString('hex'));  // '3745e48...08d59ae'
        // });
        return {
            salt: salt,
            hash: hash
        }
    },
    async isPasswordCorrect(savedHash, savedSalt, passwordAttempt) {
        let hash = await pbkdf2(String(passwordAttempt), savedSalt, iterations, 64, 'sha256')
        hash = hash.toString('hex')
        return savedHash === hash
    },
    generateObj(originObj, attributes) {
        let obj = {}
        for (const attr of attributes) {
            if (Array.isArray(attr)) {
                let [temp, newName] = attr
                if (temp.startsWith('$')) {
                    let temparr = temp.split('.').slice(1)
                    let originValue = temparr.reduce((prev, curt) => {
                        return prev[curt]
                    }, originObj)
                    obj[newName] = originValue
                } else {
                    obj[newName] = originObj[temp]
                }
            } else {
                obj[attr] = originObj[attr]
            }
        }
        return obj
    },
    checkTypeOf(obj, attributes, type) {
        for (const attr of attributes) {
            if (obj[attr] && typeof (obj[attr]) != type) {
                obj[attr] = parseFloat(obj[attr])
                if (typeof (obj[attr]) != type) {
                    return false
                }
                // return false
            }
        }
        return true
    },
    filter(originObj, attributes) {
        //过滤给定对象的属性
        let target = {}
        for (const attr of attributes) {
            if (originObj.hasOwnProperty(attr)) {
                target[attr] = originObj[attr]
            }
        }
        return target
    },
    //过滤真值属性
    filterTrue(originObj, attributes) {
        //过滤给定对象的属性
        let target = {}
        for (const attr of attributes) {
            if (originObj.hasOwnProperty(attr) && originObj[attr]) {
                target[attr] = originObj[attr]
            }
        }
        return target
    },
    exclude(originObj, attributes) {
        let target = {}
        Object.keys(originObj).forEach(key => {
            if (!attributes.includes(key)) {
                target[key] = originObj[key]
            }
        })

        return target
    },
    /**
     *处理日志输出格式
     * @param {object} obj
     * @returns {string}
     */
    formatLogger: obj =>
        Object.entries(obj)
            .map(([key, value]) => `${key}:${value}`)
            .join(',')
}
