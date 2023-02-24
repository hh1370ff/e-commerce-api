import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";

// @desc Get all users
// @route GET /users
// @access Private
export const getAllUsers = asyncHandler(async (req, res) => {
  // Get all users from MongoDB
  const users = await User.find().select("-password").lean();

  // If no users
  if (!users?.length) {
    throw new Error("No users found", 400);
  }

  res.json(users);
});

// @desc Get a users
// @route GET /users
// @access Private
export const getSingleUser = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  // Confirm data
  if (!_id) throw new Error("ID is required", 400);

  // Get single user from MongoDB
  const user = await User.findById(_id).select("-password").lean();

  // If no user
  if (!user) {
    throw new Error("No users found", 400);
  }

  res.json(user);
});

// @desc Create new user
// @route POST /users
// @access Private
export const createUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, mobile, password, userName } = req.body;

  // Confirm data
  if (!firstName || !lastName || !email || !mobile || !password || !userName)
    throw new Error("All fields are required", 400);

  // Check for duplicate username
  const duplicate = await User.findOne({
    $or: [({ email }, { mobile }, { userName })],
  })
    .lean()
    .exec();
  if (duplicate) throw new Error("Duplicate email or mobile", 409);

  // Hash password
  const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

  const userObject = { ...req.body, password: hashedPwd };

  // Create and store new user
  const user = await User.create(userObject);

  if (user) res.status(201).json({ message: `New user ${firstName} created` });
  else throw new Error("Invalid user data received", 400);
});

// @desc Update a user
// @route PATCH /users
// @access Private
export const updateUser = asyncHandler(async (req, res) => {
  const {
    _id,
    firstName,
    userName,
    lastName,
    email,
    mobile,
    password,
    roles,
    isBlocked,
    cart,
    address,
    wishlist,
  } = req.body;

  // Confirm data
  if (
    !firstName ||
    !userName ||
    !lastName ||
    !email ||
    !mobile ||
    !roles ||
    !isBlocked ||
    !cart ||
    !address ||
    !wishlist ||
    !_id
  )
    throw new Error("All fields are required", 400);

  // Does the user exist to update?
  const user = await User.findById(_id).exec();

  if (!user) {
    throw new Error("User not found", 400);
  }

  // Check for duplicate
  const duplicate = await User.findOne({
    $or: [({ email }, { mobile }, { userName })],
  })
    .lean()
    .exec();

  // Allow updates to the original user
  if (duplicate && duplicate?._id.toString() !== _id) {
    throw new Error("Duplicate username", 409);
  }



  user.firstName = firstName;
  user.userName = userName;
  user.lastName = lastName;
  user.email = email;
  user.mobile = mobile;
  user.roles = roles;
  user.isBlocked = isBlocked;
  user.cart = cart;
  user.address = address;
  user.wishlist = wishlist;

  if (password) {
    // Hash password
    user.password = await bcrypt.hash(password, 10); // salt rounds
  }

  const updatedUser = await user.save();

  res.json({ message: `${updatedUser.userName} updated` });
});

// @desc Delete a user
// @route DELETE /users
// @access Private
export const deleteUser = asyncHandler(async (req, res) => {
  const { _id } = req.body;

  // Confirm data
  if (!_id) {
    throw new Error("User ID Required", 400);
  }

  // Does the user exist to delete?
  const user = await User.findById(_id).exec();

  if (!user) {
    throw new Error("User not found", 400);
  }

  const result = await user.deleteOne();

  const reply = `Username ${result.username} with ID ${result._id} deleted`;

  res.json(reply);
});
