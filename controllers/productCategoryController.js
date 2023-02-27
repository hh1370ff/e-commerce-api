import ProductCategory from "../models/productCategory.js";
import asyncHandler from "express-async-handler";
import HttpError from "../utils/extendedError.js";

// @desc create new category
// @route POST /createCategory
// @access private
export const createCategory = asyncHandler(async (req, res) => {
  /* confirm data */
  const { title } = req.body;
  if (!title) throw new HttpError("All fields are required!", 400);

  /* creating new Category */
  const newCategory = await ProductCategory.create({ title });

  res.status(200).json(newCategory);
});

// @desc update category
// @route PUT /updateCategory
// @access private
export const updateCategory = asyncHandler(async (req, res) => {
  /* confirm data */
  const { _id, title } = req.body;
  if (!_id || !title) throw new HttpError("All fields are required", 400);

  /* check the category */
  const category = await ProductCategory.findById(_id);
  if (!category) throw new HttpError("Category not found!", 400);

  const updatedCategory = await ProductCategory.findByIdAndUpdate(
    category._id,
    { $set: req.body },
    { new: true }
  );
  res.json(updatedCategory);
});

// @desc delete category
// @route DELETE /updateCategory
// @access private
export const deleteCategory = asyncHandler(async (req, res) => {
  /* confirm data */
  const { _id } = req.body;
  if (!_id) throw new HttpError("Al fields are required", 400);

  /* check the category */
  const category = await ProductCategory.findById(_id);
  if (!category) throw new HttpError("Category not found!", 400);

  const result = await category.deleteOne();

  const reply = `category with title ${result.title} is deleted`;

  res.json(reply);
});

// @desc get single category
// @route GET /getSingleCategory
// @access public
export const getSingleCategory = asyncHandler(async (req, res) => {
  /* confirm data */
  const { _id } = req.params;
  if (!_id) throw new HttpError("All fields are required", 400);

  const category = await ProductCategory.findById(_id).lean();

  // If no category
  if (!category) throw new HttpError("category not found", 400);

  res.json(category);
});

// @desc get all categories
// @route GET /getAllCategories
// @access public
export const getAllCategories = asyncHandler(async (req, res) => {
  const getallCategory = await ProductCategory.find();
  res.json(getallCategory);
});
