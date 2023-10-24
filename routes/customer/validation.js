const yup = require('yup');

const customerSchema = yup.object({
    body: yup.object({
      firstName: yup.string().required("firstName: Họ nhân viên chưa được nhập").max(50, 'Họ nhân viên quá dài'),
      lastName: yup.string().required("lastName: Tên nhân viên chưa được nhập").max(50, 'Tên nhân viên quá dài'),
      email: yup.string()
      .required("email: Email chưa được nhập")
      .test('email type', 'email: Email không hợp lệ', (value) => {
        const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

        return emailRegex.test(value);
      }),

        phoneNumber: yup.string()
        .required("phoneNumber: Số điện thoại chưa được nhập")
        .test('phoneNumber type', 'phoneNumber: Không phải số điện thoại hợp lệ', (value) => {
          const phoneRegex = /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;

          return phoneRegex.test(value);
        }),

        address: yup.string()
        .required("address: Địa chỉ chưa được nhập")
        .max(500, 'Địa chỉ không được vượt quá 500 ký tự'),

        password: yup.string()
        .required("password: Mật khẩu chưa được nhập")
        .min(3, 'Không được ít hơn 3 ký tự')
        .max(12, 'Không được vượt quá 12 ký tự'),
    }),
});

const customerPatchSchema = yup.object({
    body: yup.object({
        firstName: yup.string().max(50, 'Họ khách hàng quá dài'),
        lastName: yup.string().max(50, 'Tên khách hàng quá dài'),
        email: yup.string()
        .test('email type', 'Email không hợp lệ', (value) => {
          if(!value) return true;
          console.log('<<=== value ===>>',value);
          const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

          return emailRegex.test(value);
        }),

        phoneNumber: yup.string()
        .test('phoneNumber type', 'Không phải số điện thoại hợp lệ', (value) => {
          if(!value) return true;
          const phoneRegex = /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;

          return phoneRegex.test(value);
        }),

        address: yup.string()
        .max(500, 'Địa chỉ không được vượt quá 500 ký tự'),

        password: yup.string()
        .min(3, 'Không được ít hơn 3 ký tự')
        .max(12, 'Không được vượt quá 12 ký tự'),
    }),
});

module.exports = {
    customerSchema,
    customerPatchSchema,
};