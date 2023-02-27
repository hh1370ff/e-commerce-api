import Enquiry from "../models/enquiryModel.js";
import asyncHandler from "express-async-handler";
import HttpError from "../utils/extendedError.js";

// @desc create enquiry
// @route POST /createEnquiry
// @access public
export const createEnquiry = asyncHandler(async (req, res) => {
  /* confirm data */
  const { name, email, mobile, comment } = req.body;
  if (!name || !email || !mobile || !comment)
    throw new HttpError("All fields are required");

  const newEnquiry = await Enquiry.create(req.body);
  res.json(newEnquiry);
});

// @desc update enquiry
// @route PUT /updateEnquiry
// @access private
export const updateEnquiry = asyncHandler(async (req, res) => {
  /* confirm data */
  const { _id, name, email, mobile, comment } = req.body;
  if (!name || !email || !mobile || !comment || !_id)
    throw new HttpError("All fields are required");

  /* check enquiry */
  const enquiry = await Enquiry.findById(_id);
  if (!enquiry) throw new HttpError("enquiry not found!", 400);

  const updatedEnquiry = await Enquiry.findByIdAndUpdate(
    enquiry._id,
    { $set: req.body },
    { new: true }
  );

  res.json(updatedEnquiry);
});

// @desc delete enquiry
// @route DELETE /deleteEnquiry
// @access private
export const deleteEnquiry = asyncHandler(async (req, res) => {
  /* confirm data */
  const { _id } = req.body;
  if (!_id) throw new HttpError("All fields are required!", 400);
  /* check enquiry */
  const enquiry = await Enquiry.findById(_id);
  if (!enquiry) throw new HttpError("enquiry not found!", 400);

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
  if (!enquiry) throw new HttpError("enquiry not found", 400);

  res.json(enquiry);
});

// @desc get all enquiries
// @route GET /getAllEnquiries
// @access public
export const getAllEnquiries = asyncHandler(async (req, res) => {
  const getallEnquiry = await Enquiry.find();

  /* check enquiries */
  if (getallEnquiry.length === 0)
    throw new HttpError("Enquiries not found!", 400);

  res.json(getallEnquiry);
});
