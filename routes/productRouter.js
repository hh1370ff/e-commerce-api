import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
} from "../controllers/productController.js";
const productRouter = express.Router();

productRouter.route("/createProduct").post(createProduct);
productRouter.route("/updateProduct").put(updateProduct);
productRouter.route("/getAllProducts").get(getAllProduct);
productRouter.route("/deleteProduct").delete(deleteProduct);
productRouter.route("/getSingleProduct/:_id").get(getSingleProduct);

export default productRouter;
