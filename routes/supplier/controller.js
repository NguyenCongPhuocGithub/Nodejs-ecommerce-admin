const { fuzzySearch } = require("../../utils");
const { Supplier } = require("../../models");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const results = await Supplier.find({ isDeleted: false });

      return res
        .status(200)
        .json({ code: 200, message: "Thành công", count: results.length, payload: results });
    } catch (err) {
      return res
        .status(200)
        .json({ code: 200, message: "Thất bại", error: err });
    }
  },

  getList: async (req, res, next) => {
    try {
      const { page, pageSize } = req.query;
      const limit = pageSize || 10;
      const skip = (page - 1) * limit || 0;

      const conditionFind = { isDeleted: false };

      let results = await Supplier.find(conditionFind)
        .skip(skip)
        .limit(limit)
        .sort({ name: 1, email: 1 })
        .lean();

      const total = await Supplier.countDocuments(conditionFind);

      return res
        .status(200)
        .json({
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
      const { id } = req.params;

      let result = await Supplier.findOne({
        _id: id,
        isDeleted: false,
      });

      if (result) {
        return res
          .status(200)
          .json({ code: 200, message: "Thành công", payload: result });
      }

      return res.status(404).json({ code: 404, message: "Không tìm thấy" });
    } catch (error) {
      return res
        .status(404)
        .json({ code: 404, message: "Thất bại", error: err });
    }
  },

  create: async (req, res, next) => {
    try {
      const { name, email, phoneNumber, address } = req.body;

      //tạo một đối tượng mới của model Supplier trong Mongoose
      const newRecord = new Supplier({
        name,
        email,
        phoneNumber,
        address,
      });

      let result = await newRecord.save();

      return res.send(200, {
        message: "Thành công",
        payload: result,
      });
    } catch (error) {
      return res.send(404, {
        message: "Thất bại",
        error,
      });
    }
  },

  search: async (req, res, next) => {
    try {
      const { name, address, email } = req.query;
      const conditionFind = { isDeleted: false };

      if (name) conditionFind.name = fuzzySearch(name);
      if (address) conditionFind.address = fuzzySearch(address);
      if (email) conditionFind.email = fuzzySearch(email);

      const result = await Supplier.find(conditionFind);

      return res
        .status(200)
        .json({ code: 200, message: "Thành công", payload: result });
    } catch (err) {
      return res
        .status(404)
        .json({ code: 404, message: "Thất bại", error: err });
    }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, email, phoneNumber, address } = req.body;

      const updateSupplier = await Supplier.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { name, email, phoneNumber, address },
        { new: true }
      );

      if (updateSupplier) {
        return res
          .status(200)
          .json({ code: 200, message: "Thành công", payload: updateSupplier });
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

      const result = await Supplier.findOneAndUpdate(
        { _id: id, isDeleted: false },
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
