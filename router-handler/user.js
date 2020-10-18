const db = require('../db/index')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {
    use
} = require('../router/user')
const config = require('../config/config')
const {
    createSixCode
} = require('../utils/index.js')
const nodemail = require('../config/sendMail.js')
exports.regUser = (req, res) => {
    const userInfo = req.body
    const sql = 'select * from ev_users where username=?'
    db.query(sql, userInfo.username, (err, results) => {
        if (err) {
            return res.cc(err)
        }
        if (results.length > 0) {
            return res.cc('当前用户名已被占用')
        }
        const sqlcode = 'select * from ev_code where code=? and email=?'
        db.query(sqlcode, [req.body.code, req.body.email], (err, result) => {
            if (err) return res.cc(err)
            if (result.length == 0) return res.cc('邮箱验证码错误')
            const nowDate = new Date().getTime()
            if (nowDate - new Date(result[0].date).getTime() > (60000 * config.emailCodeEffectiveTime)) {
                return res.cc('邮箱验证码超时，请重新获取')
            }
            userInfo.password = bcrypt.hashSync(userInfo.password, 12)
            const sql = 'insert into ev_users set ?'
            db.query(sql, {
                username: userInfo.username,
                password: userInfo.password,
                islive: 'yes'
            }, (err, results) => {
                if (err) {
                    return res.cc(err)
                }
                if (results.affectedRows !== 1) return res.cc('操作失败')
                res.send({
                    result: true,
                    data: null,
                    dataExt: '操作成功'
                })
            })
        })

    })
}
exports.login = (req, res) => {
    const userInfo = req.body
    const sql = 'select * from ev_users where username=?'
    db.query(sql, userInfo.username, (err, result) => {
        if (err) return res.cc(err)
        if (result.length !== 1) return res.cc('用户名错误')
        const compareResult = bcrypt.compareSync(userInfo.password, result[0].password)
        if (!compareResult) {
            return res.cc('密码错误')
        }
        // 获取用户信息生成token
        const user = {
            ...result[0],
            password: null,
            user_pic: null
        }
        const tokenStr = jwt.sign(user, config.jwtSecretKey, {
            expiresIn: config.expiresIn
        })
        res.send({
            result: true,
            data: null,
            dataExt: '登录成功',
            token: 'bearer ' + tokenStr
        })
    })
}

exports.getEmailCode =  (req, res) => {
    let userInfo = {
        email: req.body.email,
        username: req.body.username,
        code: createSixCode(),
        date: new Date(),
        islive: 'no'
    }
    const sql = 'select * from ev_code where email=?'
  
    db.query(sql, req.body.email, async (err, result) => {
        if (err) return res.cc(err)
        if (result.length > 0) {
            db.query('update ev_code set ? where email=?', [{
                date: userInfo.date,
                code: userInfo.code
            }, result[0].email], (err, result) => {
                console.log(err)
            })
        } else {
            const sql = 'insert into ev_code set ?'
            db.query(sql, {
                email: req.body.email,
                code: userInfo.code,
                date: userInfo.date,
            }, (err, result) => {
                if (err) return res.cc(err)
                if (result.affectedRows !== 1) return res.cc('操作失败')
               
            })
        }
        const emailTep = await getEmailTemplate(1)
        const str = emailTep.bodybefore + `<td style="background: #fff;padding: 50px 44px 25px 40px;font-size:16px"><p>尊敬的用户，您的验证码为${userInfo.code}，${config.emailCodeEffectiveTime}分钟内有效。</p></td>` + emailTep.bodyafter
        let mail = {
            from: 'm13077009969@163.com',
            subject: '用户注册验证',
            to: userInfo.email,
            html: str
        }
        nodemail(mail)
        res.cc('操作成功', true)
    })




}

const getEmailTemplate = (type) => {
    return new Promise((res, rej) => {
        const sql = 'select * from ev_email_style where type=?'
        db.query(sql, type, (err, result) => {
            if (err || result.length == 0) {
                rej(err)
            }
            res(result[0])
        })
    })


}