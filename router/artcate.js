const express = require('express')
const router = express.Router()
const artCateHandler = require('../router-handler/artcate')
const expressJoi = require('@escook/express-joi')
const {
    add_cate_schema,
    cate_id_schema,
    update_cate_schema
} = require('../schema/artcate')
router.get('/cates', artCateHandler.getArtCates)
router.post('/addCate', expressJoi(add_cate_schema), artCateHandler.addArtCate)
router.get('/deleteCate/:id', expressJoi(cate_id_schema), artCateHandler.deleteArtCateById)
router.get('/cateByid/:id', expressJoi(cate_id_schema), artCateHandler.getArtCateById)
router.post('/updateCate', expressJoi(update_cate_schema), artCateHandler.updateArtCate)
module.exports = router