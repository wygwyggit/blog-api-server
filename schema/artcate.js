const joi = require('@hapi/joi')
const name = joi.string().max(50).required()
const id = joi.number().integer().min(1).required()
const artCateSchema = {
    add_cate_schema: {
        body: {
            name
        }
    },
    cate_id_schema: {
        params: {
            id
        }
    },
    update_cate_schema: {
        body: {
            id,
            name
        }
    }
}
module.exports = artCateSchema