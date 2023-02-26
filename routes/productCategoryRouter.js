import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
} from "../controllers/productCategoryController.js";
import { verifyJWT, isAdmin } from "../middleware/verifyJWT.js";
const productCategoryRouter = express.Router();

/* admin routs */
productCategoryRouter
  .route("/createCategory")
  .post(verifyJWT, isAdmin, createCategory);
productCategoryRouter
  .route("/updateCategory")
  .put(verifyJWT, isAdmin, updateCategory);
productCategoryRouter
  .route("/deleteCategory")
  .delete(verifyJWT, isAdmin, deleteCategory);

/* user routes */

/* public routes */
productCategoryRouter.route("/getSingleCategory/:_id").get(getSingleCategory);
productCategoryRouter.route("/getAllCategories").get(getAllCategories);
export default productCategoryRouter;
