import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import HttpError from "../utils/extendedError.js";

// @desc Create new user
// @route POST /users
// @access Private
export const createUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, mobile, password, userName } = req.body;

  // Confirm data
  if (!firstName || !lastName || !email || !mobile || !password || !userName)
    throw new HttpError("All fields are required", 400);

  // Check for duplicate username
  const duplicate = await User.findOne({
    $or: [{ email }, { mobile }, { userName }],
  })
    .lean()
    .exec();

  if (duplicate) throw new HttpError("Duplicate email or mobile", 409);

  // Hash password
  const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

  const userObject = { ...req.body, password: hashedPwd };

  // Create and store new user
  const user = await User.create(userObject);
  res.status(201).json({ message: `New user ${firstName} created` });
});

// @desc Update a user
// @route PUT /users
// @access Private
export const updateUser = asyncHandler(async (req, res) => {
  const { firstName, userName, lastName, email, mobile, password } = req.body;

  // Confirm data
  if (!firstName || !userName || !lastName || !email || !mobile)
    throw new HttpError("All fields are required", 400);

  const { _id } = req.user;
  // Does the user exist to update?
  const user = await User.findById(_id).exec();

  if (!user) {
    throw new HttpError("User not found", 400);
  }

  // Check for duplicate
  const duplicate = await User.findOne({
    $or: [{ email }, { mobile }, { userName }],
  })
    .lean()
    .exec();

  // Allow updates to the original user
  if (duplicate && duplicate?._id.toString() !== _id.toString()) {
    throw new HttpError("Duplicate email or mobile or userName", 409);
  }

  let updateUser;
  if (password) {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10); // salt rounds

    updateUser = await User.findByIdAndUpdate(
      user._id,
      { $set: { ...req.body, password: hashedPassword } },
      { new: true }
    );
  } else {
    updateUser = await User.findByIdAndUpdate(
      user._id,
      { $set: req.body },
      { new: true }
    );
  }

  res.json(updateUser);
});

// @desc Get all users
// @route GET /users
// @access Private
export const getAllUsers = asyncHandler(async (req, res) => {
  // Get all users from MongoDB
  const users = await User.find().select("-password").lean();

  // If no users
  if (!users?.length) {
    throw new HttpError("No users found", 400);
  }

  res.json(users);
});

// @desc Get a users
// @route GET /users
// @access Private
export const getSingleUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  // Get single user from MongoDB
  const user = await User.findById(_id).select("-password").lean();

  // If no user
  if (!user) {
    throw new HttpError("No users found", 400);
  }

  res.json(user);
});

// @desc Delete a user
// @route DELETE /users
// @access Private
export const deleteUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  // Confirm data
  if (!_id) {
    throw new HttpError("User ID Required", 400);
  }

  // Does the user exist to delete?
  const user = await User.findById(_id).exec();

  if (!user) {
    throw new HttpError("User not found", 400);
  }

  const result = await user.deleteOne();

  const reply = `Username ${result.username} with ID ${result._id} deleted`;

  res.json(reply);
});

// @desc forgetPassword
// @route POST /forgetPassword
// @access Public
export const forgotPassword = asyncHandler(async (req, res) => {
  // Confirm data
  const { email } = req.body;
  if (!email) throw new HttpError("Email is required!", 400);

  // Does the user exist?
  const user = await User.findOne({ email });
  if (!user) throw new HttpError("User not Found", 400);

  const token = await user.generatePasswordResetToken();
  await user.save();
  const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:3500/api/users/reset-password/${token}'>Click Here</>`;
  const data = {
    to: email,
    text: "Hey User",
    subject: "Forgot Password Link",
    html: resetURL,
  };
  sendEmail(data);
  res.json(token);
});

// @desc resetPassword
// @route POST /resetPassword
// @access Public
export const resetPassword = asyncHandler(async (req, res) => {
  // Confirm data
  const { password } = req.body;
  if (!password) throw new HttpError("password is required!", 400);

  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Does the user exist?
  const user = await User.findOne({ passwordResetToken: hashedToken });
  if (!user) throw new HttpError("unAuthorized!", 401);

  if (new Date() >= user.passwordResetExpires)
    throw new HttpError("UnAuthorized! Token is expired!", 401);

  /* Hash password */
  const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

  /* update user */
  user.password = hashedPwd;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.json({ message: "Password is updated." });
});
