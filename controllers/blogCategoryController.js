import BlogCategory from "../models/blogCategoryModel.js";
import asyncHandler from "express-async-handler";
import HttpError from "../utils/extendedError.js";

// @desc create category
// @route POST /createCategory
// @access Private
export const createCategory = asyncHandler(async (req, res) => {
  /* confirm data */
  const { title } = req.body;
  if (!title) throw new HttpError("Title is required", 400);

  // Check for duplicate blogCategory
  const duplicate = await BlogCategory.findOne({ title }).lean().exec();

  if (duplicate) throw new HttpError("Duplicate title", 409);

  const newBlogCategory = await BlogCategory.create(req.body);
  res.json(newBlogCategory);
});

// @desc update category
// @route PUT /updateCategory
// @access Private
export const updateCategory = asyncHandler(async (req, res) => {
  /* confirm data */
  const { _id, title } = req.body;
  if (!_id || !title) throw new HttpError("All fields are required", 400);
  const blogCategory = await BlogCategory.findById(_id);

  /* check blogCategory exist */
  if (!blogCategory) throw new HttpError("BlogCategory not found!", 400);

  // Check for duplicate
  const duplicate = await BlogCategory.findOne({ title }).lean().exec();

  // Allow updates to the original blogCategory
  if (duplicate && duplicate?._id.toString() !== _id.toString()) {
    throw new HttpError("Duplicate blogCategory", 409);
  }

  const updatedBlogCategory = await BlogCategory.findByIdAndUpdate(
    _id,
    req.body,
    {
      new: true,
    }
  );
  res.json(updatedBlogCategory);
});

// @desc delete category
// @route DELETE /deleteCategory
// @access Private
export const deleteCategory = asyncHandler(async (req, res) => {
  /* confirm data */
  const { _id } = req.body;
  if (!_id) throw new HttpError("_id is required", 400);

  /* check blogCategory exist */
  const blogCategory = await BlogCategory.findById(_id);
  if (!blogCategory) throw new HttpError("BlogCategory not found!", 400);

  const deletedBlogCategory = await BlogCategory.findByIdAndDelete(_id);
  res.json(deletedBlogCategory);
});

// @desc get category
// @route GET /getSingleCategory
// @access public
export const getSingleCategory = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  const blogCategory = await BlogCategory.findById(_id);

  /* check blogCategory exist */
  if (!blogCategory) throw new HttpError("BlogCategory not found!", 400);

  res.json(blogCategory);
});

// @desc get all category
// @route GET /getAllCategory
// @access public
export const getAllCategories = asyncHandler(async (req, res) => {
  const blogCategories = await BlogCategory.find();

  /* check blogCategories */
  if (blogCategories.length === 0)
    throw new HttpError("No blogCategory found!", 400);
  res.json(blogCategories);
});
