const { fuzzySearch } = require("../../utils");
const { Customer } = require("../../models");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const results = await Customer.find({ isDeleted: false });

      return res
        .status(200)
        .json({ code: 200, message: "Thành công", count: results.length, payload: results });
    } catch (err) {
      return res
        .status(404)
        .json({ code: 404, message: "Thất bại", error: err });
    }
  },

  getList: async (req, res, next) => {
    try {
      const { page, pageSize } = req.query;
      const limit = pageSize || 10;
      const skip = (page - 1) * limit || 0;

      const conditionFind = { isDeleted: false };

      let results = await Customer.find(conditionFind)
        .skip(skip)
        .limit(limit)
        .sort({
          lastName: 1,
          firstName: 1,
          birthday: 1,
          email: 1,
          phoneNumber: 1,
        })
        .lean();

      const total = await Customer.countDocuments(conditionFind);

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

      let result = await Customer.findOne({
        _id: id,
        isDeleted: false,
      });

      if (result) {
        return res
          .status(200)
          .json({ code: 200, message: "Thành công", payload: result });
      }

      return res.status(404).json({ code: 404, message: "Không tìm thấy" });
    } catch (err) {
      return res
        .status(404)
        .json({ code: 404, message: "Thất bại", error: err });
    }
  },

  create: async (req, res, next) => {
    try {
      const {
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        password,
        birthday,
      } = req.body;

      //tạo một đối tượng mới của model Customer trong Mongoose
      const newRecord = new Customer({
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        password,
        birthday,
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

  search: async (req, res, next) => {
    try {
      const { firstName, lastName, address, email } = req.query;
      const conditionFind = { isDeleted: false };

      if (firstName) conditionFind.firstName = fuzzySearch(firstName);
      if (lastName) conditionFind.lastName = fuzzySearch(lastName);
      if (address) conditionFind.address = fuzzySearch(address);
      if (email) conditionFind.email = fuzzySearch(email);

      const result = await Customer.find(conditionFind);

      return res.send(200, { message: "Thành công", payload: result });
    } catch (error) {
      return res.send(404, {
        message: "Thất bại",
        error,
      });
    }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const {
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        password,
        birthday,
      } = req.body;

      const updateCustomer = await Customer.findOneAndUpdate(
        { _id: id, isDeleted: false },
        {
          firstName,
          lastName,
          email,
          phoneNumber,
          address,
          password,
          birthday,
        },
        { new: true }
      );

      if (updateCustomer) {
        return res.status(200).json({
          message: "Thành công",
          payload: updateCustomer,
        });
      }
    } catch (error) {
      return res.send(404, {
        message: "Thất bại",
        error,
      });
    }
  },

  softDelete: async (req, res, next) => {
    try {
      const { id } = req.params;

      const result = await Customer.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { isDeleted: true },
        { new: true }
      );

      if (result) {
        return res.send(200, {
          message: "Thành công",
          payload: result,
        });
      }

      return res.send(400, {
        message: "Không xóa thành công",
      });
    } catch (error) {
      return res.send(404, {
        message: "Thất bại",
        error,
      });
    }
  },
};
