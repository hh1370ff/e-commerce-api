import express from "express";
import {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  getSingleCoupon,
  applyCoupon,
} from "../controllers/couponController.js";
import { verifyJWT, isAdmin } from "../middleware/verifyJWT.js";
const couponRouter = express.Router();

/* admin routes */
couponRouter.route("/createCoupon").post(verifyJWT, isAdmin, createCoupon);
couponRouter.route("/getAllCoupons").get(verifyJWT, isAdmin, getAllCoupons);
couponRouter.route("/updateCoupon").put(verifyJWT, isAdmin, updateCoupon);
couponRouter.route("/deleteCoupon").delete(verifyJWT, isAdmin, deleteCoupon);
couponRouter
  .route("/getSingleCoupon/:_id")
  .get(verifyJWT, isAdmin, getSingleCoupon);

/* user routes */
couponRouter.route("/applyCoupon").post(verifyJWT, applyCoupon);

export default couponRouter;
