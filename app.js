const express = require('express')
const cors = require('cors')
const joi = require('@hapi/joi')
const userRouter = require('./router/user')
const userInfoRouter = require('./router/userInfo')
const artCate = require('./router/artcate')
const app = express()
const expressJwt = require('express-jwt')
const config = require('./config/config')

app.use(cors())
app.use(express.urlencoded({
    extended: false
}))
app.use((req, res, next) => {
    res.cc = (err, result = false) => {
        res.send({
            result,
            data: null,
            dataExt: err instanceof Error ? err.message : err
        })
    }
    next()
})
// 配置解析token的中间件
app.use(expressJwt({
    secret: config.jwtSecretKey,
    credentialsRequired: true,
    algorithms: ['HS256']
}).unless({
    path: ['/apiBlog/reguser', '/apiBlog/login','/apiBlog/getEmailCode']
}))
app.use('/apiBlog', userRouter)
app.use('/my',userInfoRouter)
app.use('/my/article',artCate)
// 错误级别中间件
app.use((err, req, res, next) => {
    if (err instanceof joi.ValidationError) return res.cc(err)
    if (err.name === 'UnauthorizedError') return res.cc('身份验证失败')
    res.cc(err)
    next()
})
app.listen('8080', () => {
    console.log('server running at http:127.0.0.1:8080')
})