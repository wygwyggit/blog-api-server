const db = require('../db/index')

exports.getArtCates= (req,res) => {
    const sql = 'select * from ev_article_cate where is_delete = 0 order by id desc'
    db.query(sql,(err,result) => {
        if(err) return res.cc(err)
        res.send({
            result:true,
            data:result,
            dataExt:'操作成功'
        })
    })
}
exports.addArtCate = (req,res) => {
    const sql = 'select * from ev_article_cate where name=?'
    db.query(sql,req.body.name,(err,result) => {
        if(err) return res.cc(err)
        if(result.length !==0) {
            return res.cc('该分类名称已存在')
        }
        const sql = 'insert into ev_article_cate set ?'
        db.query(sql, req.body,(err, result) => {
            if(err) return res.cc(err)
            if(result.affectedRows !== 1) return res.cc('操作失败')
            res.cc('操作成功',true)
        })
        
    })
}
exports.deleteArtCateById = (req,res) => {
    const sql = 'update ev_article_cate set is_delete=1 where Id=?'
    db.query(sql,req.params.id,(err,result) => {
        if(err) return res.cc(err)
        if(result.affectedRows !== 1) return res.cc('操作失败')
        res.cc('操作成功',true)
    })
}
exports.updateArtCate = (req,res) => {
    const sql = 'select * from ev_article_cate where id<>? and name=?'
    db.query(sql,[req.body.id,req.body.name],(err,result) => {
        if(err) return res.cc(err)
        if(result.length > 0) return res.cc('该分类名称已存在')
        const sql = "update ev_article_cate set ? where id=?"

        db.query(sql,[req.body,req.body.id],(err, result) => {
            if(err) return res.cc(err) 
            if(result.affectedRows !== 1) return res.cc('操作失败')
            res.cc('操作成功',true)
        })
    })
}
exports.getArtCateById = (req,res) => {
    const sql = 'select * from ev_article_cate where Id=?' 
    db.query(sql,req.params.id,(err,result) => {
        if(err) return res.cc(err)
        if(result.length == 0) return res.cc('操作失败')
        res.send({
            result:true,
            data:result[0],
            dataExt:'操作成功'
        })
    })
}