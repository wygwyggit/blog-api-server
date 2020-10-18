const express = require('express')
const router = express.Router()
const expressJoi = require('@escook/express-joi')
const userInfo_handler = require('../router-handler/userInfo')
const {update_userinfo_schema,update_userpwd_schema} = require('../schema/user')
router.get('/userinfo',userInfo_handler.getUserInfo)
router.post('/updateUserInfo',expressJoi(update_userinfo_schema), userInfo_handler.updateUserInfo)
router.post('/updateUserPwd',expressJoi(update_userpwd_schema), userInfo_handler.updateUserPwd)
module.exports = router