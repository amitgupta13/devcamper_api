const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

//@desc Get all users
//@route GET /api/v1/users
//@access Private/admin
exports.getUsers = async (req, res, next) => {
  res.status(200).json(res.advancedResults);
};

//@desc Get single users
//@route GET /api/v1/users/:id
//@access Private/admin
exports.getUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({ success: true, data: user });
};

//@desc Create users
//@route POST /api/v1/users
//@access Private/admin
exports.createUser = async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({ success: true, data: user });
};

//@desc Update users
//@route PUT /api/v1/users/:id
//@access Private/admin
exports.updateUser = async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.status(200).json({ success: true, data: user });
};

//@desc Delete users
//@route PUT /api/v1/users/:id
//@access Private/admin
exports.deleteUser = async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, data: {} });
};
