const yup = require("yup");

 const categorySchema = yup.object({
    body: yup.object({
      name: yup.string().required("name: Tên của danh mục chưa được nhập"),
      description: yup.string().max(500).required("description: Mô tả chưa được nhập"),
    }),
  });

  const categoryPatchSchema = yup.object({
    body: yup.object({
      name: yup.string().max(50),
      isDeleted: yup.boolean(),
      description: yup.string().max(500),
    }),
  });

module.exports = {
  categorySchema,
  categoryPatchSchema,
};

