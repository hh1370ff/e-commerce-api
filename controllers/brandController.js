import Brand from "../models/brandModel.js";
import asyncHandler from "express-async-handler";
import HttpError from "../utils/extendedError.js";

// @desc create brand
// @route POST /createBrand
// @access Private
export const createBrand = asyncHandler(async (req, res) => {
  /* confirm data */
  const { title } = req.body;
  if (!title) throw new HttpError("Title is required", 400);

  // Check for duplicate brand
  const duplicate = await Brand.findOne({ title }).lean().exec();

  if (duplicate) throw new HttpError("Duplicate title", 409);

  const newBrand = await Brand.create(req.body);
  res.json(newBrand);
});

// @desc Update Brand
// @route PUT /updateBrand
// @access Private
export const updateBrand = asyncHandler(async (req, res) => {
  /* confirm data */
  const { _id, title } = req.body;
  if (!_id || !title) throw new HttpError("All fields are required", 400);
  const brand = await Brand.findById(_id);

  /* check brand exist */
  if (!brand) throw new HttpError("Brand not found!", 400);

  // Check for duplicate
  const duplicate = await Brand.findOne({ title }).lean().exec();

  // Allow updates to the original brand
  if (duplicate && duplicate?._id.toString() !== _id.toString()) {
    throw new HttpError("Duplicate brand", 409);
  }

  const updatedBrand = await Brand.findByIdAndUpdate(_id, req.body, {
    new: true,
  });
  res.json(updatedBrand);
});

// @desc delete brand
// @route DELETE /deleteBrand
// @access Private
export const deleteBrand = asyncHandler(async (req, res) => {
  /* confirm data */
  const { _id } = req.body;
  if (!_id) throw new HttpError("_id is required", 400);

  /* check brand exist */
  const brand = await Brand.findById(_id);
  if (!brand) throw new HttpError("Brand not found!", 400);

  const deletedBrand = await Brand.findByIdAndDelete(_id);
  res.json(deletedBrand);
});

// @desc get single brand
// @route GET /getSingleBrand
// @access public
export const getSingleBrand = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  const brand = await Brand.findById(_id);

  /* check brand exist */
  if (!brand) throw new HttpError("Brand not found!", 400);

  res.json(brand);
});

// @desc get all brand
// @route GET /getAllBrand
// @access public
export const getAllBrand = asyncHandler(async (req, res) => {
  const brands = await Brand.find();

  /* check brands */
  if (brands.length === 0) throw new HttpError("No brand found!", 400);
  res.json(brands);
});
