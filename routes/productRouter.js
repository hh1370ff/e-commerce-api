import express from "express";
import {
  addRemoveFormWishlist,
  createProduct,
  deleteProduct,
  getAllProduct,
  getSingleProduct,
  rateProduct,
  updateProduct,
} from "../controllers/productController.js";
import { verifyJWT, isAdmin } from "../middleware/verifyJWT.js";
const productRouter = express.Router();

/* admin routes */
productRouter.route("/createProduct").post(verifyJWT, isAdmin, createProduct);
productRouter.route("/updateProduct").put(verifyJWT, isAdmin, updateProduct);
productRouter.route("/deleteProduct").delete(verifyJWT, isAdmin, deleteProduct);

/* user routes */
productRouter
  .route("/addRemoveFormWishlist")
  .post(verifyJWT, addRemoveFormWishlist);
productRouter.route("/rateProduct").post(verifyJWT, rateProduct);

/* public routes */
productRouter.route("/getAllProducts").get(getAllProduct);
productRouter.route("/getSingleProduct/:_id").get(getSingleProduct);

export default productRouter;
