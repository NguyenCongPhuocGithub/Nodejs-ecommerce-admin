const yup = require('yup');
const ObjectId = require('mongodb').ObjectId;

const updateStatusSchema = yup.object({
    body: yup.object({
        status: yup.string()
          .required("status: Trạng thái được bỏ trống")
          .oneOf(['WAITING', 'COMPLETED', 'CANCELED', 'REJECTED', 'DELIVERING'], 'Trạng thái không hợp lệ'),
      }),
});

const createSchema= yup.object({
    body: yup.object({
      createdDate: yup.date(),

      shippedDate: yup
        .date()
        .test('check date', 'Ngày tháng không hợp lệ', (value) => {
          if (!value) return true;

          if (value && this.createdDate && value < this.createdDate) {
            return false;
          }

          if (value < new Date()) {
            return false;
          }

          return true;
        }),

      paymentType: yup.string()
        .required("paymentType: Phương thức thanh toán chưa được nhập")
        .oneOf(['CASH', 'CREDIT_CARD'], 'Phương thức thanh toán không hợp lệ'),

      status: yup.string()
        .required(true, "status: Trạng thái chưa được nhập")
        .oneOf(['WAITING', 'COMPLETED', 'CANCELED'], 'Trạng thái không hợp lệ'),

      customerId: yup
        .string()
        .test('validationCustomerID', 'ID sai định dạng', (value) => {
          return ObjectId.isValid(value);
        }),

      employeeId: yup
        .string()
        .test('validationEmployeeID', 'ID sai định dạng', (value) => {
          return ObjectId.isValid(value);
        }),

      productList: yup.array().of(
        yup.object().shape({
          productId: yup
            .string()
            .test('validationProductID', 'ID sai định dạng', (value) => {
              return ObjectId.isValid(value);
            }),

          quantity: yup.number().required("quantity: Số lượng chưa được nhập").min(0),

          // price: yup.number().required("price: Giá chưa được nhập").min(0),

          // discount: yup.number().required("discount: Phần trăm giảm giá chưa được nhập").min(0),
        }),
      ),
    }),
});

const updateShippingDateSchema = yup.object({
    body: yup.object({
      shippedDate: yup
        .date()
        .test('check date', 'Ngày tháng không hợp lệ', (value) => {
          if (!value) return true;

          if (value && this.createdDate && value < this.createdDate) {
            return false;
          }

          if (value < new Date()) {
            return false;
          }

          return true;
        }),
    }),
});


const updateEmployeeSchema =  yup.object({
    body: yup.object({
      employeeId: yup
        .string()
        .test('validationEmployeeID', 'ID sai định dạng', (value) => {
          return ObjectId.isValid(value);
        }),
    }),
});


const updateCustomerSchema = yup.object({
    body: yup.object({
      customerId: yup
        .string()
        .test('validationCustomerID', 'ID sai định dạng', (value) => {
          return ObjectId.isValid(value);
        }),
    }),
});

module.exports = {
    updateStatusSchema,
    createSchema,
    updateShippingDateSchema,
    updateEmployeeSchema,
    updateCustomerSchema,
};



