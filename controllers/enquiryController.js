import Enquiry from "../models/enquiryModel.js";
import asyncHandler from "express-async-handler";

// @desc create enquiry
// @route POST /createEnquiry
// @access public
export const createEnquiry = asyncHandler(async (req, res) => {
  const newEnquiry = await Enquiry.create(req.body);
  if (!newEnquiry) throw new Error("Invalid information!", 400);
  res.json(newEnquiry);
});

// @desc update enquiry
// @route PUT /updateEnquiry
// @access private
export const updateEnquiry = asyncHandler(async (req, res) => {
  /* confirm data */
  const { _id } = req.body;
  if (!_id) throw new Error("All fields are required!", 400);

  /* check enquiry */
  const enquiry = await Enquiry.findById(_id);
  if (!enquiry) throw new Error("enquiry not found!", 400);

  await enquiry.updateOne(req.body, { new: true });
  res.json({ message: "enquiry is updated" });
});

// @desc delete enquiry
// @route DELETE /deleteEnquiry
// @access private
export const deleteEnquiry = asyncHandler(async (req, res) => {
  /* confirm data */
  const { _id } = req.body;
  if (!_id) throw new Error("All fields are required!", 400);
  /* check enquiry */
  const enquiry = await Enquiry.findById(_id);
  if (!enquiry) throw new Error("enquiry not found!", 400);

  await enquiry.deleteOne();
  res.json({ message: "enquiry is deleted" });
});

// @desc get single enquiry
// @route GET /getSingleEnquiry
// @access public
export const getSingleEnquiry = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  /* check enquiry */
  const enquiry = await Enquiry.findById(_id);
  if (!enquiry) throw new Error("enquiry not found", 400);

  res.json(enquiry);
});

// @desc get all enquiries
// @route GET /getAllEnquiries
// @access public
export const getAllEnquiries = asyncHandler(async (req, res) => {
  const getallEnquiry = await Enquiry.find();

  /* check enquiries */
  if (getallEnquiry.length === 0) throw new Error("Enquiries not found!", 400);

  res.json(getallEnquiry);
});
