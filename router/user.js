const express = require('express')
const router = express.Router()
const expressJoi = require('@escook/express-joi')
const {
    reg_schema,
    login_schema,
    get_email_code
} = require('../schema/user')
const userRouterHandler = require('../router-handler/user')
router.post('/reguser', expressJoi(reg_schema), userRouterHandler.regUser)
router.post('/login', expressJoi(login_schema), userRouterHandler.login)
router.post('/getEmailCode',expressJoi(get_email_code),userRouterHandler.getEmailCode)
module.exports = router