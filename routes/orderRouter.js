import express from "express";
import {
  createOrder,
  getUserOrders,
  getAllOrders,
  getOrderByUserId,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { verifyJWT, isAdmin } from "../middleware/verifyJWT.js";
const orderRouter = express.Router();

/* admin routes */
orderRouter.route("/getAllOrders").get(verifyJWT, isAdmin, getAllOrders);
orderRouter
  .route("/getOrderByUserId/:_id")
  .get(verifyJWT, isAdmin, getOrderByUserId);
orderRouter
  .route("/updateOrderStatus")
  .put(verifyJWT, isAdmin, updateOrderStatus);

/* user routes */
orderRouter.route("/createOrder").post(verifyJWT, createOrder);
orderRouter.route("/getUserOrders").get(verifyJWT, getUserOrders);

export default orderRouter;
