import express from "express";
import {
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getSingleEnquiry,
  getAllEnquiries,
} from "../controllers/enquiryController.js";
import { verifyJWT, isAdmin } from "../middleware/verifyJWT.js";
const enquiryRouter = express.Router();

/* admin routs */
enquiryRouter.route("/updateEnquiry").put(verifyJWT, isAdmin, updateEnquiry);
enquiryRouter.route("/deleteEnquiry").delete(verifyJWT, isAdmin, deleteEnquiry);

/* public routes */
enquiryRouter.route("/createEnquiry").post(createEnquiry);
enquiryRouter.route("/getSingleEnquiry/:_id").get(getSingleEnquiry);
enquiryRouter.route("/getAllEnquiries").get(getAllEnquiries);

export default enquiryRouter;
