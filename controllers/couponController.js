import Coupon from "../models/couponModel.js";
import asyncHandler from "express-async-handler";
import HttpError from "../utils/extendedError.js";
import User from "../models/userModel.js";
import Cart from "../models/cartModel.js";

// @desc create a new coupon
// @route POST /createCoupon
// @access Private
export const createCoupon = asyncHandler(async (req, res) => {
  /* confirm data */
  const { name, expiry, discount } = req.body;
  if (!name || !expiry || !discount)
    throw new HttpError("All fields are required!", 400);

  // Check for duplicate name
  const duplicate = await Coupon.findOne({ name }).lean().exec();

  if (duplicate) throw new HttpError("Coupon with the same name exist!", 409);

  const coupon = await Coupon.create(req.body);

  res.json(coupon);
});

// @desc Get all coupons
// @route GET /getAllCoupons
// @access Private
export const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find();
  if (coupons.length === 0) throw new HttpError("No coupon found!", 400);
  res.json(coupons);
});

// @desc update coupon
// @route PUT /updateCoupon
// @access Private
export const updateCoupon = asyncHandler(async (req, res) => {
  /* confirm data */

  const { _id, name, expiry, discount } = req.body;
  if (!name || !expiry || !discount || !_id)
    throw new HttpError("All fields are required", 400);

  // Check for duplicate
  const duplicate = await Coupon.findOne({ name }).lean().exec();
  if (duplicate && duplicate?._id.toString() !== _id.toString()) {
    throw new HttpError("Coupon with the same name exist!", 409);
  }

  /* check coupon */
  const coupon = await Coupon.findById(_id);
  if (!coupon) throw new HttpError("Coupon not found", 400);

  const updatedCoupon = await Coupon.findByIdAndUpdate(
    coupon._id,
    { $set: req.body },
    { new: true }
  );

  res.json(updatedCoupon);
});

// @desc delete coupon
// @route DELETE /deleteCoupon
// @access Private
export const deleteCoupon = asyncHandler(async (req, res) => {
  /* confirm data */
  const { _id } = req.body;
  if (!_id) throw new HttpError("all fields are required!", 400);

  /* check coupon */
  const coupon = await Coupon.findById(_id);
  if (!coupon) throw new HttpError("Coupon not found!", 400);

  await coupon.deleteOne();
  res.json({ message: "coupon is deleted" });
});

// @desc Get all users
// @route GET /users
// @access Private
export const getSingleCoupon = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  /* check coupon */
  const coupon = await Coupon.findById(_id);
  if (!coupon) throw new HttpError("Coupon not found!", 400);
  res.json(coupon);
});

// @desc apply coupon
// @route POST /applyCoupon
// @access Private
export const applyCoupon = asyncHandler(async (req, res) => {
  /* confirm data */
  const { couponName } = req.body;
  if (!couponName) throw new HttpError("All fields are required", 400);

  const { _id } = req.user;
  const coupon = await Coupon.findOne({ name: couponName });

  /* confirm coupon */
  if (coupon === null) throw new HttpError("Invalid Coupon", 400);

  /* check expiration */
  if (coupon.expiry < new Date()) throw new HttpError("Coupon is expired", 400);

  const user = await User.findOne({ _id });
  const { totalPrice } = await Cart.findOne({ orderBy: user._id });

  /* price after discount */
  const totalPriceAfterDiscount = (
    totalPrice *
    (1 - coupon.discount / 100)
  ).toFixed(1);

  /* update cart */
  await Cart.findOneAndUpdate(
    { orderby: user._id },
    { totalPriceAfterDiscount }
  );
  res.json(totalPriceAfterDiscount);
});
