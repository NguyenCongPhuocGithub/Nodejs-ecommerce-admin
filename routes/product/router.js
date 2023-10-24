var express = require('express');
var router = express.Router();

const {validateSchema, checkIdSchema} = require('../../utils')

const {getDetail, getList, getAll, search, create, update, softDelete, fake} = require('./controller');
// const { validationSchema, validationQuerySchema} = require('./validation');
const { validationSchema, validationQuerySchema } = require('./validation');

router.route('/all')
    .get(getAll);

router.route('/')
    .get(getList)
    .post(validateSchema(validationSchema), create);

// router.route('/fake')
//     .post(fake)
    
router.get('/search', validateSchema(validationQuerySchema), search);

router.route('/:id')
    .get(getDetail)
    .put(validateSchema(checkIdSchema), validateSchema(validationSchema), update);


router.patch('/delete/:id', softDelete);

module.exports = router;