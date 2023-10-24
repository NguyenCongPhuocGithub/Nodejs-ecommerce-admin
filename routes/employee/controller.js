const {fuzzySearch} = require('../../utils');
const {Employee} = require('../../models');

module.exports = {
    getAll: async(req, res, next) =>{
        try {
            const results = await Employee.find({isDeleted: false});

            return res.status(200).json({ code: 200, message: "Thành công", count: results.length, payload: results})
        } catch (err) {
            return res.status(404).json({ code: 404,
                message: "Thất bại",
                error: err,
            })
        }
    },

    getList: async (req, res, next) => {
        try {
            const {page, pageSize} = req.query;
            const limit = pageSize || 10;
            const skip = (page - 1) * limit || 0;

            const conditionFind = {isDeleted: false};

            const results = await Employee.find(conditionFind)
            .skip(skip)
            .limit(limit)
            .sort({lastName: 1, firstName: 1,birthday:1, email: 1, phoneNumber: 1})
            .lean();

            const total = await Employee.countDocuments(conditionFind);

            return res.status(200).json({ code: 200, message: "Thành công", total, count: results.length, payload: results});
        } catch (error) {
            return res.status(404).json({ code: 404 ,message: "Thất bại", error});
        }
    },

    getDetail: async(req, res, next) => {
        try {
            const {id} = req.params;

            let result = await Employee.findOne({
                _id: id,
                isDeleted: false,
            })

            if(result){
                return res.status(200).json({ code: 200, message: "Thành công",payload: result});
            }

            return res.status(404).json({ code: 404,message: 'Không tìm thấy'})
        } catch (err) {
            return res.status(404).json({ code: 404,message: "Thất bại", error: err})
        }
    },

    create: async(req, res, next) => {
        try {
            const { firstName, lastName, email, phoneNumber, address, password, birthday } = req.body;

            //tạo một đối tượng mới của model Employee trong Mongoose
            const newRecord = new Employee({
                firstName, lastName, email, phoneNumber, address, password, birthday
            });

            let result = await newRecord.save();

            return res.status(200).json({ code: 200,
                message: "Thành công",
                payload: result,
            });
        } catch (err) {
            return res.status(404).json({ code: 404,
              message: "Thất bại",
              error: err,
            });
        }
    },

    search: async(req, res, next) => {
        try {
            const { firstName, lastName, address, email, phoneNumber } = req.query;
            const conditionFind = { isDeleted: false };

            if (firstName) conditionFind.firstName = fuzzySearch(firstName);
            if (lastName) conditionFind.lastName = fuzzySearch(lastName);
            if (address) conditionFind.address = fuzzySearch(address);
            if (email) conditionFind.email = fuzzySearch(email);
            if (phoneNumber) conditionFind.phoneNumber = fuzzySearch(phoneNumber);

            const result = await Employee.find(conditionFind);

            return res.status(200).json({ code: 200, message: "Thành công", payload: result})
        } catch (err) {
            return res.status(404).json({ code: 404,
                message: "Thất bại",
                error: err,
            });
        }
    },

    update: async(req, res, next) => {
        try {
            const {id} = req.params;
            const {firstName, lastName, email, phoneNumber, address, password, birthday} = req.body;
            console.log('<<=== req.body ===>>', req.body);
    
            const updateEmployee = await Employee.findOneAndUpdate(
                {_id: id, isDeleted: false},
                {firstName, lastName, email, phoneNumber, address, password, birthday},
                {new: true},
            );
    
            if (updateEmployee) {
                return res.status(200).json({ code: 200,
                  message: "Thành công",
                  payload: updateEmployee,
                });
            }
        } catch (err) {
            return res.status(404).json({ code: 404,
                message: "Thất bại",
                error: err,
              }); 
        }
    },

    softDelete: async (req, res, next) => {
        try {
          const { id } = req.params;
    
          const result = await Employee.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { isDeleted: true },
            { new: true },
          );
    
          if (result) {
            return res.status(200).json({ code: 200,
              message: "Thành công",
              payload: result,
            });
          }
    
          return res.status(404).json({ code: 404,
            message: "Không xóa thành công",
          });
        } catch (err) {
          return res.status(404).json({ code: 404,
            message: "Thất bại",
            error,
          });
        }
    },
};