import express from "express";
import {
  createProduct,
  getAllProduct,
  updateProduct,
} from "../controllers/productController.js";
const productRouter = express.Router();

productRouter.route("/createProduct").post(createProduct);
productRouter.route("/updateProduct").put(updateProduct);
productRouter.route("/getAllProducts").get(getAllProduct);

export default productRouter;
