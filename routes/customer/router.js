var express = require('express');
var router = express.Router();

const { validateSchema, checkIdSchema } = require('../../utils');
const {customerSchema, customerPatchSchema} = require('./validation');

const{getAll, getList, getDetail, create, search, softDelete, update} = require('./controller');

router.route('/all')
    .get(getAll)

router.route('/')
  .get(getList)
  .post(validateSchema(customerSchema), create);

router.get('/search', search);

router.route('/:id')
  .get(validateSchema(checkIdSchema), getDetail)
  .put(validateSchema(checkIdSchema), validateSchema(customerSchema), update)
  .patch(validateSchema(checkIdSchema), validateSchema(customerPatchSchema), update)
  .patch(validateSchema(checkIdSchema), softDelete);

module.exports = router;