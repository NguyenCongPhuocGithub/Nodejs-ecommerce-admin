var express = require('express');
var router = express.Router();

const { validateSchema, checkIdSchema } = require('../../utils');
const {employeeSchema, employeePatchSchema} = require('./validation');

const{getAll, getList, getDetail, create, search, softDelete, update} = require('./controller');

router.route('/all')
    .get(getAll)

router.route('/')
  .get(getList)
  .post(validateSchema(employeeSchema), create);

router.get('/search', search);

router.route('/:id')
  .get(validateSchema(checkIdSchema), getDetail)
  .put(validateSchema(checkIdSchema), validateSchema(employeeSchema), update)
  .patch(validateSchema(checkIdSchema), validateSchema(employeePatchSchema), update)
  .patch(validateSchema(checkIdSchema), softDelete);

module.exports = router;