const db = require('../db/index')
const bcrypt = require('bcrypt')
exports.getUserInfo = (req, res) => {
    const sql = 'select id, username,nickname,email,user_pic from ev_users where id=?'
    db.query(sql, req.user.id, (err, result) => {
        if (err) return res.cc(err)
        if (result.length <= 0) {
            return res.cc('操作失败')
        }
        res.send({
            result: true,
            data: result[0],
            dataExt: '操作成功'
        })
    })
}
exports.updateUserInfo = (req, res) => {
    const sql = 'update ev_users set ? where id=?'
    db.query(sql, [req.body, req.body.id], (err, result) => {
        if (err) return res.cc(err)
        if (result.length <= 0) return res.cc('操作失败')
        res.cc('操作成功', true)
    })
}
exports.updateUserPwd = (req, res) => {
    // 判断当前用户是否存在
    const sql = "select * from ev_users where id=?"
    db.query(sql, req.user.id, (err, result) => {
        if (err) return res.cc(err)
        if (result.length !== 1) {
            return res.cc('用户不存在')
        }
        // 判断原密码是否一致
        const isTrueOldPwd = bcrypt.compareSync(req.body.oldpwd, result[0].password)
        if (!isTrueOldPwd) return res.cc('原密码错误')
        const sql = 'update ev_users set password=? where id=?'
        const newPwd = bcrypt.hashSync(req.body.newpwd,12)
        db.query(sql,[newPwd,req.user.id],(err, result) => {
            if(err) return res.cc(err)
            if(result.affectedRows !== 1) return res.cc('操作失败')
            return res.cc('密码修改成功',true)

        }) 
    })

}