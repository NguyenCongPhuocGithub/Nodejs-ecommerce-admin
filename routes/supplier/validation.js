const yup = require('yup');

const supplierSchema = yup.object({
    body: yup.object({
        name : yup.string()
        .max(50, 'Tên nhà cung cấp quá dài')
        .required('name: Tên nhà cung cấp chưa được nhập'),

        email: yup.string()
        .max(50, "Email nhà cung cấp quá dài")
        .required("email: Email nhà cung cấp chưa được nhập")
        .test('email type', 'Email không hợp lệ', (value) => {
          if(!value) return(true);
          const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

          return emailRegex.test(value);
        }),
  
      phoneNumber: yup.string()
        .max(50, "phoneNumber nhà cung cấp quá dài")
        .required("phoneNumber: Số điện thoại nhà cung cấp chưa được nhập")
        .test('phoneNumber type', 'Không phải số điện thoại hợp lệ', (value) => {
          if(!value) return(true);
          const phoneRegex = /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;

          return phoneRegex.test(value);
        }),
  
      address: yup.string()
        .max(300, "Địa chỉ nhà cung cấp quá dài")
        .required("address: Địa chỉ nhà cung cấp chưa được nhập"),
    }),
});

const supplierPatchSchema = yup.object({
    body: yup.object({
        name: yup.string()
        .max(50, "Tên nhà cung cấp quá dài"),
  
      email: yup.string()
        .max(50, "Email nhà cung cấp quá dài")
        .test('email type', 'Email không hợp lệ', (value) => {
          if(!value) return(true);
          const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

          return emailRegex.test(value);
        }),
  
      phoneNumber: yup.string()
        .max(50, "phoneNumber nhà cung cấp quá dài")
        .test('phoneNumber type', 'Không phải số điện thoại hợp lệ', (value) => {
          if(!value) return(true);
          const phoneRegex = /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;

          return phoneRegex.test(value);
        }),
  
      address: yup.string()
        .max(300, "Địa chỉ nhà cung cấp quá dài"),
    }),
});

module.exports = {
    supplierSchema,
    supplierPatchSchema,
}