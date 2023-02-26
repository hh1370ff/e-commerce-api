import ProductCategory from "../models/productCategory.js";
import asyncHandler from "express-async-handler";

// @desc create new category
// @route POST /createCategory
// @access private
export const createCategory = asyncHandler(async (req, res) => {
  /* confirm data */
  const { title } = req.body;
  if (!title) throw new Error("All fields are required!", 400);

  /* creating new Category */
  const newCategory = await ProductCategory.create({ title });

  /* check validity of info */
  if (!newCategory) throw new Error("Invalid info!", 400);

  res.status(200).json(newCategory);
});

// @desc update category
// @route PUT /updateCategory
// @access private
export const updateCategory = asyncHandler(async (req, res) => {
  /* confirm data */
  const { _id, title } = req.body;
  if (!_id || !title) throw new Error("All fields are required", 400);

  /* check the category */
  const category = await ProductCategory.findById(_id);
  if (!category) throw new Error("Category not found!", 400);

  const updatedCategory = await category.update(
    { title },
    {
      new: true,
    }
  );
  if (!updatedCategory) throw new Error("Invalid info", 400);
  res.status(200).json({ message: "Category is updated" });
});

// @desc delete category
// @route DELETE /updateCategory
// @access private
export const deleteCategory = asyncHandler(async (req, res) => {
  /* confirm data */
  const { _id } = req.body;
  if (!_id) throw new Error("Al fields are required", 400);

  /* check the category */
  const category = await ProductCategory.findById(_id);
  if (!category) throw new Error("Category not found!", 400);

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
  if (!_id) throw new Error("All fields are required", 400);

  const category = await ProductCategory.findById(_id).lean();

  // If no category
  if (!category) throw new Error("category not found", 400);

  res.json(category);
});

// @desc get all categories
// @route GET /getAllCategories
// @access public
export const getAllCategories = asyncHandler(async (req, res) => {
  const getallCategory = await ProductCategory.find();
  res.json(getallCategory);
});
