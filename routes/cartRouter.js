import express from "express";
import {
  createCart,
  getCart,
  deleteCart,
} from "../controllers/cartController.js";
import { verifyJWT, isAdmin } from "../middleware/verifyJWT.js";
const cartRouter = express.Router();

/* user routes */
cartRouter.route("/createCart").post(verifyJWT, createCart);
cartRouter.route("/getCart").get(verifyJWT, getCart);
cartRouter.route("/deleteCart").delete(verifyJWT, deleteCart);

export default cartRouter;
