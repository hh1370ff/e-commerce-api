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
const blogRouter = express.Router();

blogRouter.route("/createBlog").post(createBlog);
blogRouter.route("/updateBlog").put(updateBlog);
blogRouter.route("/getAllBlogs").get(getAllBlogs);
blogRouter.route("/getSingleBlog/:_id").get(getSingleBlog);
blogRouter.route("/deleteBlog").delete(deleteBlog);
blogRouter.route("/hitLike").post(hitLike);
blogRouter.route("/hitDislike").post(hitDislike);

export default blogRouter;
