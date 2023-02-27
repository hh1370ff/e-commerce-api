import express from "express";
import {
  createColor,
  updateColor,
  deleteColor,
  getSingleColor,
  getAllColors,
} from "../controllers/colorController.js";
import { verifyJWT, isAdmin } from "../middleware/verifyJWT.js";
const colorRouter = express.Router();

/* admin routes */
colorRouter.route("/createColor").post(verifyJWT, isAdmin, createColor);
colorRouter.route("/updateColor").put(verifyJWT, isAdmin, updateColor);
colorRouter.route("/deleteColor").delete(verifyJWT, isAdmin, deleteColor);

/* user routes */

/* public route */
colorRouter.route("/getSingleColor/:_id").get(getSingleColor);
colorRouter.route("/getAllColors").get(getAllColors);

export default colorRouter;
