import express from "express";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getSingleCategory,
  getAllCategories,
} from "../controllers/blogCategoryController.js";
import { verifyJWT, isAdmin } from "../middleware/verifyJWT.js";
const blogCategoryRouter = express.Router();

/* admin routes */
blogCategoryRouter
  .route("/createCategory")
  .post(verifyJWT, isAdmin, createCategory);
blogCategoryRouter
  .route("/updateCategory")
  .put(verifyJWT, isAdmin, updateCategory);
blogCategoryRouter
  .route("/deleteCategory")
  .delete(verifyJWT, isAdmin, deleteCategory);

/* public routes */
blogCategoryRouter.route("/getSingleCategory/:_id").get(getSingleCategory);
blogCategoryRouter.route("/getAllCategories").get(getAllCategories);

export default blogCategoryRouter;
