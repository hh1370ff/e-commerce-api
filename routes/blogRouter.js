import express from "express";
import {
  createBlog,
  updateBlog,
  getAllBlogs,
  getSingleBlog,
  deleteBlog,
  hitLike,
  hitDislike,
} from "../controllers/blogController.js";
import { verifyJWT, isAdmin } from "../middleware/verifyJWT.js";
const blogRouter = express.Router();

/* admin routs */
blogRouter.route("/createBlog").post(verifyJWT, isAdmin, createBlog);
blogRouter.route("/updateBlog").put(verifyJWT, isAdmin, updateBlog);
blogRouter.route("/deleteBlog").delete(verifyJWT, isAdmin, deleteBlog);

/* user routes */
blogRouter.route("/hitLike").post(verifyJWT, hitLike);
blogRouter.route("/hitDislike").post(verifyJWT, hitDislike);

/* public routes */
blogRouter.route("/getAllBlogs").get(getAllBlogs);
blogRouter.route("/getSingleBlog/:_id").get(getSingleBlog);

export default blogRouter;
