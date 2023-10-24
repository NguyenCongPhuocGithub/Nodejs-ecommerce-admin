const { fuzzySearch } = require("../../utils");
const { Category } = require("../../models");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const results = await Category.find({ isDeleted: false });

      return res
        .status(200)
        .json({ code: 200, message: "Thành công", count: results.length, payload: results });
    } catch (err) {
      return res.status(404).json({
        code: 404,
        message: "Thất bại",
        error: err,
      });
    }
  },

  getList: async (req, res, next) => {
    try {
      const { page, pageSize } = req.query;
      const limit = pageSize || 10;
      const skip = (page - 1) * limit || 0;

      const conditionFind = { isDeleted: false };

      let results = await Category.find(conditionFind)
        .skip(skip)
        .limit(limit)
        .sort({ name: 1 });

      const total = await Category.countDocuments(conditionFind);

      return res
        .status(200)
        .json({ code: 200, message: "Thành công", total, count: results.length, payload: results });
    } catch (err) {
      return res
        .status(404)
        .json({ code: 404, message: "Thất bại", error: err });
    }
  },

  getDetail: async (req, res, next) => {
    try {
      const { id } = req.params;

      let result = await Category.findOne({
        _id: id,
        isDeleted: false,
      });

      if (result) {
        return res.status(200).json({ code: 200, payload: result });
      }

      return res.status(404).json({ code: 404, message: "Không tìm thấy" });
    } catch (err) {
      return res
        .status(404)
        .json({ code: 404, message: "Thất bại", error: err });
    }
  },

  search: async (req, res, next) => {
    try {
      const { name } = req.query;
      const conditionFind = { isDeleted: false };

      if (name) conditionFind.name = fuzzySearch(name);

      const result = await Category.find(conditionFind);

      return res
        .status(200)
        .json({ code: 200, message: "Thành công", payload: result });
    } catch (err) {
      return res
        .status(404)
        .json({ code: 404, message: "Thất bại", error: err });
    }
  },

  create: async (req, res, next) => {
    try {
      const { name, description } = req.body;

      //tạo một đối tượng mới của model Category trong Mongoose
      const newRecord = new Category({
        name,
        description,
      });

      let result = await newRecord.save();

      return res
        .status(200)
        .json({ code: 200, message: "Thành công", payload: result });
    } catch (error) {
      return res.status(404).json({ code: 404, message: "Thất bại", error });
    }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const updateCategory = await Category.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { name, description },
        { new: true }
      );

      if (updateCategory) {
        return res
          .status(200)
          .json({ code: 200, message: "Thành công", payload: updateCategory });
      }
    } catch (err) {
      return res
        .status(404)
        .json({ code: 404, message: "Thất bại", error: err });
    }
  },

  softDelete: async (req, res, next) => {
    try {
      const { id } = req.params;

      const result = await Category.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { isDeleted: true },
        { new: true }
      );

      if (result) {
        return res.status(200).json({
          code: 200,
          message: "Thành công",
          payload: result,
        });
      }

      return res
        .status(404)
        .json({ code: 404, message: "Không xóa thành công" });
    } catch (error) {
      return res
        .status(404)
        .json({ code: 404, message: "Thất bại", error: err });
    }
  },
};
