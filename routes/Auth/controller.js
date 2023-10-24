const JWT = require("jsonwebtoken");

const { generateToken, generateRefreshToken } = require("../../utils/jwtHelper");
const { Employee } = require("../../models");
const jwtSettings = require("../../constants/jwtSetting");

module.exports = {
  login: async (req, res, next) => {
    try {
      const {
        _id,
        firstName,
        lastName,
        phoneNumber,
        address,
        email,
        birthday,
        updatedAt,
      } = req.user;

      console.log('««««« req.user »»»»»', req.user);

      const token = generateToken({
        _id,
        firstName,
        lastName,
        phoneNumber,
        address,
        email,
        birthday,
        updatedAt,
      });
      const refreshToken = generateRefreshToken(_id);

      return res.status(200).json({
        code: 200,
        message: "Thành công",
        token,
        refreshToken,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ code: 500, message: "Thất bại", error: err });
    }
  },

  checkRefreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;

      JWT.verify(
        refreshToken,
        jwtSettings.SECRET,
        async (err, payload, done) => {
          if (err) {
            return res.status(401).json({
              message: "refreshToken không hợp lệ",
            });
          } else {
            const { id } = payload;

            const employee = await Employee.findOne({
              _id: id,
              isDeleted: false,
            })
              .select("-password")
              .lean();

            if (employee) {
              const {
                _id,
                firstName,
                lastName,
                phoneNumber,
                address,
                email,
                birthday,
                updatedAt,
              } = employee;

              const token = generateToken({
                _id,
                firstName,
                lastName,
                phoneNumber,
                address,
                email,
                birthday,
                updatedAt,
              });

              return res
                .status(200)
                .json({ code: 200, message: "Thành công", token: token });
            }
            return res
              .status(401)
              .json({ code: 401, message: "Không thành công" });
          }
        }
      );
    } catch (err) {
      return res.status(404).json({
        code: 404,
        message: "Thất bại",
        error: err,
      });
    }
  },

  basicLogin: async (req, res, next) => {
    try {
      const user = await Employee.findById(req.user._id)
        .select("-password")
        .lean();
      const token = generateToken(user);

      return res
        .status(200)
        .json({ code: 200, message: "Thành công", token: token });
    } catch (err) {
      return res
        .status(500)
        .json({ code: 500, message: "Thất bại", error: err });
    }
  },

  getMe: async (req, res, next) => {
    try {
      return res.status(200).json({
        code: 200,
        message: "Thành công",
        payload: req.user,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ code: 500, message: "Thất bại", error: err });
    }
  },
};
