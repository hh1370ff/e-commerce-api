import Coupon from "../models/couponModel.js";
import asyncHandler from "express-async-handler";

// @desc create a new coupon
// @route POST /createCoupon
// @access Private
export const createCoupon = asyncHandler(async (req, res) => {
  /* confirm data */
  const { name, expiry, discount } = req.body;
  if (!name || !expiry || !discount)
    throw new Error("All fields are required", 400);

  const coupon = await Coupon.create(req.body);
  /* check the validity of data */
  if (!coupon) throw new Error("Invalid information", 400);

  res.json(coupon);
});

// @desc Get all coupons
// @route GET /getAllCoupons
// @access Private
export const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find();
  if (coupons.length === 0) throw new Error("No coupon found!", 400);
  res.json(coupons);
});

// @desc update coupon
// @route PUT /updateCoupon
// @access Private
export const updateCoupon = asyncHandler(async (req, res) => {
  /* confirm data */

  const { _id, name, expiry, discount } = req.body;
  if (!name || !expiry || !discount || !_id)
    throw new Error("All fields are required", 400);

  /* check the validity of data */
  const coupon = await Coupon.findById(_id);
  if (!coupon) throw new Error("Coupon not found", 400);

  await coupon.updateOne(req.body);

  res.json({ message: "coupon is updated" });
});

// @desc delete coupon
// @route DELETE /deleteCoupon
// @access Private
export const deleteCoupon = asyncHandler(async (req, res) => {
  /* confirm data */
  const { _id } = req.body;
  if (!_id) throw new Error("all fields are required!", 400);

  /* check the validity of data */
  const coupon = await Coupon.findById(_id);
  if (!coupon) throw new Error("Coupon not found!", 400);

  await coupon.deleteOne();
  res.json({ message: "coupon is deleted" });
});

// @desc Get all users
// @route GET /users
// @access Private
export const getSingleCoupon = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const coupon = await Coupon.findById(_id);
  if (!coupon) throw new Error("Coupon not found!", 400);
  res.json(coupon);
});
