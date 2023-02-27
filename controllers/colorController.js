import Color from "../models/colorModel.js";
import asyncHandler from "express-async-handler";
import HttpError from "../utils/extendedError.js";

// @desc create color
// @route POST /createColor
// @access Private
export const createColor = asyncHandler(async (req, res) => {
  /* confirm data */
  const { title } = req.body;
  if (!title) throw new HttpError("Title is required!", 400);

  // Check for duplicate color
  const duplicate = await Color.findOne({ title }).lean();

  if (duplicate) throw new HttpError("Duplicate title", 409);

  const color = await Color.create(req.body);
  res.json(color);
});

// @desc update color
// @route put /updateColor
// @access Private
export const updateColor = asyncHandler(async (req, res) => {
  /* confirm data */
  const { _id, title } = req.body;
  if (!_id || !title) throw new HttpError("All fields are required!", 400);

  // Check for duplicate
  const duplicate = await Color.findOne({ title }).lean().exec();
  if (duplicate && duplicate?._id.toString() !== _id.toString()) {
    throw new HttpError("Duplicate title", 409);
  }

  /* check color */
  const color = await Color.findById(_id);
  if (!color) throw new HttpError("Color not found!", 400);

  const updatedColor = await Color.findByIdAndUpdate(
    color._id,
    { $set: { title } },
    { new: true }
  );
  res.json({ updatedColor });
});

// @desc delete color
// @route DELETE /deleteColor
// @access Private
export const deleteColor = asyncHandler(async (req, res) => {
  /* confirm data */
  const { _id } = req.body;
  if (!_id) throw new HttpError("All fields are required", 400);

  /* check color */
  const color = await Color.findById(_id);
  if (!color) throw new HttpError("Color not found", 400);

  await color.deleteOne();
  res.json({ message: "Color is deleted" });
});

// @desc get single color
// @route GET /getSingleColor
// @access public
export const getSingleColor = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  /* check color */
  const color = await Color.findById(_id);
  if (!color) throw new HttpError("color not found", 400);

  res.json(color);
});

// @desc Get all colors
// @route GET /getAllColors
// @access public
export const getAllColors = asyncHandler(async (req, res) => {
  const colors = await Color.find();
  if (colors.length === 0) throw new HttpError("Colors not found!", 400);
  res.json(colors);
});
