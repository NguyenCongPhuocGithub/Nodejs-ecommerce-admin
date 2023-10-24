var express = require('express');
var router = express.Router();

const { validateSchema, checkIdSchema } = require('../../utils');
const { categorySchema, categoryPatchSchema } = require('./validation');

const {getAll, getList, getDetail, create, search, softDelete, update} = require('./controller');

router.route('/all')
    .get(getAll)

router.route('/')
  .get(getList)
  .post(validateSchema(categorySchema), create);

router.get('/search', search);

router.route('/:id')
  .get(validateSchema(checkIdSchema), getDetail)
  .put(validateSchema(checkIdSchema), validateSchema(categorySchema), update)
  .patch(validateSchema(checkIdSchema), validateSchema(categoryPatchSchema), update)
  .patch(validateSchema(checkIdSchema), softDelete);

module.exports = router;