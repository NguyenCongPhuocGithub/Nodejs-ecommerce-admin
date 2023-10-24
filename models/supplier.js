const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const supplierSchema = new Schema(
    {
        name:{
            type: String,
            required: [true, 'Tên nhà cung cấp không được bỏ trống'],
            maxLength: [100, 'Tên nhà cung cấp không được vượt quá 100 ký tự'],
        },
        email:{
            type: String,
            validate: {
                validator: function(value){
                    const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                    console.log('<<=== valueSupplier ===>>',`valueSupplier: ${value}` );
                    return emailRegex.test(value);
                },
                message: (prop) => `${prop.value} không phải là email hợp lệ!`,
            },
            required: [true, 'Email không được bỏ trống'],
            unique: [true, 'Email đã tồn tại'],
        },
        phoneNumber: {
            type: String,
            validate: {
                validator: function (value) {
                  const phoneRegex = /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;
                  console.log('<<=== valuePhoneNumber ===>>',`valuePhoneNumber: ${value}` );
                  return phoneRegex.test(value);
                },
                message: (props) => `${props.value}: không phải là số điện thoại hợp lệ!`,
              },
        },
        address: {
            type: String,
            maxLength: [500, 'Địa chỉ không được vượt quá 500 ký tự'],
          },
          isDeleted: {
            type: Boolean,
            default: false,
            required: true,
          },
    },
    {
        versionKey: false,
        timestamps: true,
    },
);

const Supplier = model('suppliers', supplierSchema);
module.exports = Supplier;