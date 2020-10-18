const joi = require('@hapi/joi')
const username = joi.string().alphanum().min(3).max(12).required().error(new Error('请输入合法的用户名'))
const password = joi.string().pattern(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/).required()


const updateUserInfo = {
    id: joi.number().integer().min(1).required(),
    nickname: joi.string().required(),
    email: joi.string().email().required()
}
const schemaObj = {
    reg_schema: {
        body: {
            username,
            password,
            code: joi.string().min(6).max(6).required(),
            email: joi.string().email().required()
        }
    },
    login_schema: {
        body: {
            username,
            password,
        }
    },
    update_userinfo_schema: {
        body: {
            id: joi.number().integer().min(1).required(),
            nickname: joi.string().required(),
            email: joi.string().email().required()
        }
    },
    update_userpwd_schema: {
        body: {
            oldpwd: password,
            newpwd: joi.not(joi.ref('oldpwd')).concat(password)
        }
    },
    get_email_code: {
        body: {
            email: joi.string().email().required()
        }
    }

}
module.exports = schemaObj