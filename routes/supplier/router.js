var express = require('express');
var router = express.Router();

const { validateSchema, checkIdSchema } = require('../../utils');
const { supplierSchema, supplierPatchSchema } = require('./validation');

const{getAll, getList, getDetail, create, search, softDelete, update} = require('./controller');

router.route('/all')
    .get(getAll)

router.route('/')
  .get(getList)
  .post(validateSchema(supplierSchema), create);

router.get('/search', search);

router.route('/:id')
  .get(validateSchema(checkIdSchema), getDetail)
  .put(validateSchema(checkIdSchema), validateSchema(supplierSchema), update)
  .patch(validateSchema(checkIdSchema), validateSchema(supplierPatchSchema), update)
  .patch(validateSchema(checkIdSchema), softDelete);

module.exports = router;