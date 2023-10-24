const express = require('express');
const router = express.Router();

const { validateSchema, checkIdSchema } = require('../../utils');
const {
    createSchema,
    updateStatusSchema,
    updateShippingDateSchema,
    updateEmployeeSchema,
    updateCustomerSchema,
} = require('./validation');
const {
    getAll,
    getList,
    getDetail,
    create,
    updateStatus,
    updateEmployee,
    updateCustomer,
    updateShippingDate,
    update,
    softDelete,
} = require('./controller');


router.route('/all')
    .get(getAll)

router.route('/')
    .get(getList)
    .post(validateSchema(createSchema), create)

router.route('/:id')
  .get(validateSchema(checkIdSchema), getDetail)
  .patch(validateSchema(checkIdSchema), update)

router.route('/status/:id')
  .patch(validateSchema(updateStatusSchema), updateStatus)

router.route('/shipping/:id')
  .patch(validateSchema(updateShippingDateSchema), updateShippingDate)

router.route('/employee/:id')
  .patch(validateSchema(updateEmployeeSchema), updateEmployee)

router.route('/customer/:id')
  .patch(validateSchema(updateCustomerSchema), updateCustomer)

router.patch('/delete/:id', softDelete);


module.exports = router;