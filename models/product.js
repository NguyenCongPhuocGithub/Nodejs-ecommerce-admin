const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');

const productSchema = new Schema(
    {
        name: {
            type: String,
            require: [true, 'Tên sản phẩm chưa được nhập vào'],
            maxLength: [50, 'Tên sản phẩm không vượt quá 50 ký tự'],
        },
        price:{
            type: Number,
            require: [true, 'Giá chưa được nhập vào'], 
            min:0, 
            default: 0,
        },
        discount:{
            type: Number,
            min: 0, 
            max: 100,
            default: 0,
        },
        stock:{
            type: Number,
            require: [true, 'Số lượng hàng tồn không để trống'],
            min: 0,
            default: 0,
        },
        categoryId:{
            type: Schema.Types.ObjectId, 
            ref: 'categories',
            require: true,
        },
        supplierId:{
            type: Schema.Types.ObjectId, 
            ref: 'suppliers',
            require: true,
        },
        description: {
            type: String,
            maxLength: [500, 'Mô tả không được vượt quá 500 ký tự'],
          },
        isDeleted:{
            type: Boolean,
            default: false,
            require: true,
        },     
    },
    {
        versionKey: false,
        TimeStamp: true,
    },
);

productSchema.virtual('discountedPrice').get(
    function () {
        const discountedPrice = (this.price * (100 - this.discount)) / 100;
        // console.log('<<=== discountedPrice ===>>',discountedPrice);
        return discountedPrice;
    }
);

productSchema.virtual('category', {
    ref: 'categories',
    localField: 'categoryId',
    foreignField: '_id',
    justOne: true,
  });

productSchema.virtual('supplier', {
    ref: 'suppliers',
    localField: 'supplierId',
    foreignField: '_id',
    justOne: true,
})

// Config
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

productSchema.plugin(mongooseLeanVirtuals);

const Product = model('products', productSchema);
module.exports = Product;