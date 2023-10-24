const { Order, Customer, Employee, Product } = require("../../models");
const { asyncForEach } = require("../../utils");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const results = await Order.find();
      return res
        .status(200)
        .json({
          code: 200,
          message: "Thành công",
          count: results.length,
          payload: results,
        });
    } catch (error) {
      return res
        .status(404)
        .json({ code: 404, message: "Thất bại", error: error });
    }
  },

  getList: async (req, res, next) => {
    try {
      const { page, pageSize } = req.query;
      const limit = pageSize || 10;
      const skip = (page - 1) * limit || 0;

      const conditionFind = {
        status: "WAITING" || "COMPLETED" || "DELIVERING",
      };

      let results = await Order.find(conditionFind)
        .skip(skip)
        .limit(limit)
        .sort({ createdDate: 1, status: 1, shippedDate: 1 })
        .lean();

      const total = await Order.countDocuments(conditionFind);

      return res.status(200).json({
        code: 200,
        message: "Thành công",
        total,
        count: results.length,
        payload: results,
      });
    } catch (error) {
      return res.status(404).json({ code: 404, message: "Thất bại", error });
    }
  },

  getDetail: async (req, res, next) => {
    try {
      const { id } = req.params;

      let result = await Order.findOne(id);

      if (result) {
        return res
          .status(200)
          .json({ code: 200, message: "Thành công", payload: result });
      }

      return res.status(404).json({ code: 404, message: "Không tìm thấy" });
    } catch (error) {
      return res
        .status(404)
        .json({ code: 404, message: "Thất bại", error: error });
    }
  },

  create: async (req, res, next) => {
    try {
      const {
        createdDate,
        shippedDate,
        status,
        paymentType,
        customerId,
        employeeId,
        productList,
      } = req.body;

      const getCustomer = Customer.findOne({
        _id: customerId,
        isDeleted: false,
      });

      const getEmployee = Employee.findOne({
        _id: employeeId,
        isDeleted: false,
      });

      const [customer, employee] = await Promise.all([
        getCustomer,
        getEmployee,
      ]);

      const errors = [];
      if (!customer) errors.push("Khách hàng không tồn tại");
      if (!employee) errors.push("Nhân viên không tồn tại");

      let resultsProductList = [];

      await asyncForEach(productList, async (item) => {
        const product = await Product.findOne({
          _id: item.productId,
          isDeleted: false,
        });

        if (!product) {
          errors.push(`Sản phẩm ${item.productId} không tồn tại`);
        } else {
          if (product.stock < item.quantity) {
            return errors.push(`Stock sản phẩm ${item.productId} không đủ`);
          }
        }

        return resultsProductList.push({
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
          discount: product.discount,
        });
      });

      if (errors.length > 0) {
        return res.status(404).json({
          code: 404,
          message: "Không thành công",
          error: `${errors}`,
        });
      }

      const newRecord = await Order({
        createdDate,
        shippedDate,
        status,
        paymentType,
        customerId,
        employeeId,
        productList: resultsProductList,
      });

      let results = await newRecord.save();

      await asyncForEach(results.productList, async (item) => {
        await Product.findOneAndUpdate(
          { _id: item.productId },
          { $inc: { stock: -item.quantity } }
        );
      });

      return res.status(200).json({
        code: 200,
        code: 200,
        message: "Thành công",
        payload: results,
      });
    } catch (err) {
      return res
        .status(404)
        .json({ code: 404, message: "Thất bại", error: err });
    }
  },

  updateStatus: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      let validOrder = await Order.findOne({
        _id: id,
        $nor: [
          { status: "CANCELED" },
          { status: "REJECTED" },
          { status: "COMPLETED" },
        ],
      });

      if (validOrder) {
        if (
          (validOrder.status === "DELIVERING" && status === "WAITING") ||
          validOrder.status === status
        ) {
          return res
            .status(410)
            .json({ code: 410, message: "Trạng thái không khả dụng" });
        }

        const result = await Order.findByIdAndUpdate(
          validOrder._id,
          { status },
          { new: true }
        );
        return res.status(200).json({
          code: 200,
          payload: result,
          message: "Thành công",
        });
      }

      return res.status(410).json({ code: 410, message: "Không thành công" });
    } catch (err) {
      return res
        .status(404)
        .json({ code: 404, message: "Thất bại", error: err });
    }
  },

  updateEmployee: async function (req, res, next) {
    try {
      const { id } = req.params;
      const { employeeId } = req.body;

      let checkOrder = await Order.findOne({
        _id: id,
        $nor: [
          { status: "CANCELED" },
          { status: "REJECTED" },
          { status: "COMPLETED" },
        ],
      });

      if (!checkOrder) {
        return res.status(404).json({
          code: 404,
          message: "Đơn hàng không khả dụng",
        });
      }

      if (checkOrder.employeeId !== employeeId) {
        const employee = await Employee.findOne({
          _id: employeeId,
          isDeleted: false,
        });

        if (!employee) {
          return res.status(404).json({
            code: 404,
            message: "Nhân viên không tồn tại",
          });
        }

        const updateOrder = await Order.findByIdAndUpdate(
          id,
          { employeeId },
          { new: true }
        );

        if (updateOrder) {
          return res.status(200).json({
            code: 200,
            message: "Cập nhật thành công",
            payload: updateOrder,
          });
        }

        return res
          .status(410)
          .json({ code: 410, message: "Không tìm thấy đơn hàng" });
      }

      return res.status(200).json({ code: 200, message: "Thành công" });
    } catch (err) {
      return res.status(404).json({ code: 404, error: err });
    }
  },

  updateCustomer: async function (req, res, next) {
    try {
      const { id } = req.params;
      const { customerId } = req.body;

      let checkOrder = await Order.findOne({
        _id: id,
        $nor: [
          { status: "CANCELED" },
          { status: "REJECTED" },
          { status: "COMPLETED" },
        ],
      });

      if (!checkOrder) {
        return res.status(404).json({
          code: 404,
          message: "Đơn hàng không khả dụng",
        });
      }

      if (checkOrder.customerId !== customerId) {
        const customer = await Customer.findOne({
          _id: customerId,
          isDeleted: false,
        });

        if (!customer) {
          return res.status(404).json({
            code: 404,
            message: "Khách hàng không tồn tại",
          });
        }

        const updateOrder = await Order.findByIdAndUpdate(
          id,
          { customerId },
          { new: true }
        );

        if (updateOrder) {
          return res.status(200).json({
            code: 200,
            message: "Cập nhật thành công",
            payload: updateOrder,
          });
        }

        return res
          .status(410)
          .json({ code: 410, message: "Không tìm thấy đơn hàng" });
      }

      return res.status(200).json({ code: 200, message: "Thành công" });
    } catch (err) {
      return res
        .status(404)
        .json({ code: 404, message: "Thất bại", error: err });
    }
  },

  updateShippingDate: async function (req, res, next) {
    try {
      const { id } = req.params;
      const { shippedDate } = req.body;

      const updateOrder = await Order.findOneAndUpdate(
        {
          _id: id,
          $nor: [
            { status: "CANCELED" },
            { status: "REJECTED" },
            { status: "COMPLETED" },
          ],
        },
        { shippedDate },
        { new: true }
      );

      if (!updateOrder) {
        return res.status(404).json({ code: 404, message: "Không tìm thấy" });
      }

      return res.status(200).json({
        code: 200,
        message: "Cập nhật thành công",
        payload: updateOrder,
      });
    } catch (error) {
      return res
        .status(404)
        .json({ code: 404, message: "Thất bại", error: error });
    }
  },

  update: async function (req, res, next) {
    try {
      const { id } = req.params;
      const {
        createdDate,
        shippedDate,
        status,
        paymentType,
        customerId,
        employeeId,
        productList,
      } = req.body;

      let validOrder = await Order.findOne({
        _id: id,
        $nor: [
          { status: "CANCELED" },
          { status: "REJECTED" },
          { status: "COMPLETED" },
        ],
      });

      const getCustomer = Customer.findOne(
        { 
          _id: customerId,
          isDeleted: false,  
        }
      );
      const getEmployee = Employee.findOne(
        { 
          _id: employeeId, 
          isDeleted: false  
        },
      );

      const [customer, employee] = await Promise.all([
        getCustomer,
        getEmployee,
      ]);

      const error = [];
      if (!customer) error.push("Khách hàng không tồn tại");
      if (!employee) error.push("Nhân viên không tồn tại");

      await asyncForEach(productList, async (item) => {
        const product = await Product.findById(item.productId);

        if (!product) error.push(`Không tìm thấy sản phẩm ${item.productId}`);
      });

      if (error.length > 0) {
        return res
          .status(410)
          .json({ code: 410, error: `${error}`, message: "Không hợp lệ" });
      }

      const results = await Order.findByIdAndUpdate(
          validOrder.id,
        {
          createdDate,
          shippedDate,
          status,
          paymentType,
          customerId,
          employeeId,
          productList,
        },
        {
          new: true,
        }
      );

      if (results) {
        return res.status(200).json({
          message: "Thành công",
          payload: results,
        });
      }

      return res.status(404).json({code: 404, message: "Cập nhật không thành công"});
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  softDelete: async (req, res, next) => {
    try {
      const { id } = req.params;

      const result = await Order.findOneAndUpdate(
        {
          _id: id,
          $nor: [
            { status: "COMPLETED" },
          ],
        },
        { status: "REJECTED" },
        { new: true }
      );

      if (result) {
        return res
          .status(200)
          .json({ code: 200, message: "Thành công", payload: result });
      }

      return res.status(404).json({ code: 404, message: "Không xóa thành công" });
    } catch (err) {
      return res
        .status(404)
        .json({ code: 404, message: "Thất bại", error: err });
    }
  },
};


