const { Product, Category, Supplier } = require("../../models");
const { fuzzySearch } = require("../../utils");
const mongoose = require("mongoose");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      let results = await Product.find({
        isDeleted: false,
      })
        .populate("category")
        .populate("supplier")
        .lean();

      return res.status(200).json({
        code: 200,
        message: "Thành công",
        count: results.length,
        payload: results,
      });
    } catch (err) {
      return res
        .status(404)
        .json({ code: 404, message: "Không tìm thấy", error: err });
    }
  },

  getList: async (req, res, next) => {
    try {
      const { page, pageSize } = req.query;
      const limit = pageSize || 10;
      const skip = (page - 1) * limit || 0;

      const conditionFind = { isDeleted: false };

      let results = await Product.find(conditionFind)
        .populate("category")
        .populate("supplier")
        .skip(skip)
        .limit(limit)
        .sort({ name: 1, price: 1, discount: -1 })
        .lean();

      const total = await Product.countDocuments(conditionFind);

      return res.status(200).json({
        code: 200,
        message: "Thành công",
        total,
        count: results.length,
        payload: results,
      });
    } catch (error) {
      return res
        .status(404)
        .json({ code: 404, message: "Không tìm thấy", error });
    }
  },

  search: async (req, res, next) => {
    try {
      const {
        // keyword,
        name,
        categoryId,
        supplierId,
        priceStart,
        priceEnd,
        page,
        pageSize,
      } = req.query;

      const limit = pageSize || 10;
      const skip = (page - 1) * limit || 0;

      const conditionFind = { isDeleted: false };

      // if (keyword) {
      //   conditionFind.$or = [
      //     { $expr: { $eq: ["$name", fuzzySearch(keyword)] } },
      //     { $eq: ["$categoryId", keyword] },
      //     { $eq: ["$supplierId", keyword] },
      //   ];
      // }

      if (name) conditionFind.name = fuzzySearch(name);

      if (categoryId) {
        conditionFind.categoryId = categoryId;
      }

      if (supplierId) {
        conditionFind.supplierId = categoryId;
      }

      // if (keyword) {
      //  const keywordObjectId = mongoose.Types.ObjectId.isValid(keyword) ? mongoose.Types.ObjectId(keyword) : null;
      //   console.log('««««« keywordObjectId »»»»»', keywordObjectId);
      //   console.log('««««« keyword »»»»»', keyword);
      //   conditionFind.$or = [
      //     { name: { $regex: fuzzySearch(keyword) } },
      //     { categoryId: keywordObjectId },
      //     { supplierId: keywordObjectId },
      //   ];
      // }

      // if (keyword && typeof mongoose.Types.ObjectId.isValid(keyword)) {
      //   conditionFind.$or = [
      //     { categoryId: keyword },
      //     { supplierId: keyword },
      //   ];
      // } else if(keyword && typeof "string"){
      //   conditionFind.name = fuzzySearch(keyword);
      // }

      // if (keyword && typeof mongoose.Types.ObjectId.isValid(keyword)) {
      //   conditionFind.$or = [
      //     { categoryId: keyword },
      //     { supplierId: keyword },
      //   ];
      // } else {
      //   conditionFind.$or = [
      //     { name: { $regex: fuzzySearch(keyword), $options: 'i' } },
      //     { supplierId: keyword },
      //   ];
      // }

      // if (keyword) {
      //   if (mongoose.Types.ObjectId.isValid(keyword)) {
      //     conditionFind.$or = [
      //       { categoryId: keyword },
      //       { supplierId: keyword },
      //     ];
      //   } else {
      //     conditionFind.name = { $regex: fuzzySearch(keyword), $options: 'i' };
      //   }
      // }

      if (priceStart && priceEnd) {
        const compareStart = { $lte: ["$price", priceEnd] };
        const compareEnd = { $gte: ["$price", priceStart] };
        conditionFind.$expr = { $and: [compareStart, compareEnd] };
      } else if (priceStart) {
        conditionFind.price = { $gte: parseFloat(priceStart) };
      } else if (priceEnd) {
        conditionFind.price = { $lte: parseFloat(priceEnd) };
      }

      const results = await Product.find(conditionFind)
        .populate("category")
        .populate("supplier")
        .skip(skip)
        .limit(limit);

      // if (keyword) {
      //   conditionFind.$or = [
      //     { name: fuzzySearch(keyword)  },
      //     { 'category.name':  fuzzySearch(keyword)  },
      //     { 'supplier.name':  fuzzySearch(keyword)  },
      //   ];
      // }

      // console.log("««««« keyword »»»»»", keyword);
      // if (keyword) {
      //   const results = await Product.aggregate()
      //     .match({ isDeleted: false })
      //     .lookup({
      //       from: "categories",
      //       localField: "categoryId",
      //       foreignField: "_id",
      //       as: "category",
      //     })
      //     .lookup({
      //       from: "suppliers",
      //       localField: "supplierId",
      //       foreignField: "_id",
      //       as: "supplier",
      //     })
      //     .unwind({
      //       path: "$category",
      //       preserveNullAndEmptyArrays: true,
      //     })
      //     .unwind({
      //       path: "$supplier",
      //       preserveNullAndEmptyArrays: true,
      //     })
      //     .match({
      //       $or: [
      //         { name: { $regex: fuzzySearch(keyword) } },
      //         { "category.name": { $regex: fuzzySearch(keyword) } },
      //         { "supplier.name": { $regex: fuzzySearch(keyword) } },
      //       ],
      //     })
      //     .sort({
      //       name: 1,
      //     });

      //   return results;

      // } else if (priceStart || priceEnd) {
      //   if (priceStart && priceEnd) {
      //     const compareStart = { $lte: ["$price", priceEnd] };
      //     const compareEnd = { $gte: ["$price", priceStart] };
      //     conditionFind.$expr = { $and: [compareStart, compareEnd] };
      //   } else if (priceStart) {
      //     conditionFind.price = { $gte: parseFloat(priceStart) };
      //   } else if (priceEnd) {
      //     conditionFind.price = { $lte: parseFloat(priceEnd) };
      //   }

      //   const results = await Product.find(conditionFind)
      //     .populate("category")
      //     .populate("supplier")
      //     .skip(skip)
      //     .limit(limit);

      //   return results;

      // }

      const total = await Product.countDocuments(conditionFind);

      return res.status(200).json({
        code: 200,
        message: "Thành công",
        total,
        count: results.length,
        payload: results,
      });
    } catch (err) {
      return res
        .status(404)
        .json({ code: 404, message: "Thất bại", error: err });
    }
  },

  getDetail: async (req, res, next) => {
    try {
      console.log("<<=== chay vo day ===>>");
      const { id } = req.params;

      let result = await Product.findOne({
        _id: id,
        isDeleted: false,
      })
        .populate("category")
        .populate("supplier");

      if (result) {
        return res
          .status(200)
          .json({ code: 200, message: "Thành công", payload: result });
      }

      return res.status(404).json({ code: 404, message: "Không tìm thấy" });
    } catch (error) {
      return res.status(404).json({ code: 404, message: "Thất bại" });
    }
  },

  create: async (req, res, next) => {
    try {
      const {
        name,
        price,
        discount,
        stock,
        description,
        supplierId,
        categoryId,
      } = req.body;

      const getCategory = Category.findOne({
        _id: categoryId,
      });

      const getSupplier = Supplier.findOne({
        _id: supplierId,
      });

      const [existCategory, existSupplier] = await Promise.all([
        getCategory,
        getSupplier,
      ]);

      const error = [];
      if (!existCategory) error.push("Danh mục không khả dụng");
      if (existCategory.isDeleted) error.push("Danh mục đã bị xóa");
      if (!existSupplier) error.push("Nhà cung cấp không khả dụng");
      if (existSupplier.isDeleted) error.push("Nhà cung cấp đã bị xóa");

      if (error.length > 0) {
        return res
          .status(410)
          .json({ code: 410, error: `${error}`, message: "Không hợp lệ" });
      }

      //tạo một đối tượng mới của model Product trong Mongoose
      const newRecord = new Product({
        name,
        price,
        discount,
        stock,
        description,
        supplierId,
        categoryId,
      });

      let result = await newRecord.save();

      return res
        .status(200)
        .json({ code: 200, message: "Thành công", payload: result });
    } catch (err) {
      return res
        .status(404)
        .json({ code: 404, message: "Thất bại", error: err });
    }
  },

  // sửa lại check existCategory, existSupplier theo random
  // fake: async (req, res, next) => {
  //   try {
  //     const { products } = req.body;

  //     const getCategory = Category.findOne({
  //       isDeleted: false,
  //     });

  //     const getSupplier = Supplier.findOne({
  //       isDeleted: false,
  //     });

  //     const [existCategory, existSupplier] = await Promise.all([
  //       getCategory,
  //       getSupplier,
  //     ]);

  //     const data = products.map((item) => ({
  //       ...item,
  //       categoryId: existCategory._id,
  //       supplierId: existSupplier._id,
  //     }));
  //     let result = await Product.insertMany(data);

  //     return res
  //       .status(200)
  //       .json({ code: 200, message: "Thành công", payload: result });
  //   } catch (err) {
  //     return res
  //       .status(404)
  //       .json({ code: 404, message: "Thất bại", error: err });
  //   }
  // },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const {
        name,
        price,
        discount,
        stock,
        description,
        supplierId,
        categoryId,
      } = req.body;

      const product = await Product.findOne({ _id: id, isDeleted: false });

      if (!product) {
        return res
          .status(404)
          .json(404, { message: "Không tìm thấy sản phẩm" });
      }

      //Start build check categoryId, supplierId
      const error = [];

      if (product.supplierId.toString() !== supplierId.toString()) {
        const supplier = await Supplier.findOne({
          _id: supplierId.toString(),
          isDeleted: false,
        });

        if (!supplier) error.push("Nhà cung cấp không khả dụng");
      }

      if (product.categoryId.toString() !== categoryId) {
        const category = await Category.findOne({
          _id: categoryId.toString(),
          isDeleted: false,
        });

        if (!category) error.push("Danh mục không khả dụng");
      }

      if (error.length > 0) {
        return res
          .status(410)
          .json({ code: 410, error: `${error}`, message: "Không hợp lệ" });
      }
      //End build check categoryId, supplierId

      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { name, price, discount, stock, description, supplierId, categoryId },
        { new: true } // new: true sử dụng để có thể lấy dữ liệu sau khi update
      );

      if (updatedProduct) {
        return res.status(200).json({
          message: "Thành công",
          payload: updatedProduct,
        });
      }

      return res
        .status(404)
        .json({ code: 404, message: "Cập nhật không thành công" });
    } catch (err) {
      return res
        .status(404)
        .json({ code: 404, message: "Thất bại", error: err });
    }
  },

  softDelete: async (req, res, next) => {
    try {
      const { id } = req.params;

      const result = await Product.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true }
      );

      if (result) {
        return res
          .status(200)
          .json({ code: 200, message: "Thành công", payload: result });
      }

      return res
        .status(404)
        .json({ code: 404, message: "Không xóa thành công" });
    } catch (err) {
      return res
        .status(404)
        .json({ code: 404, message: "Thất bại", error: err });
    }
  },
};
