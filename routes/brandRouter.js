import express from "express";
import {
  createBrand,
  updateBrand,
  deleteBrand,
  getSingleBrand,
  getAllBrand,
} from "../controllers/brandController.js";
import { verifyJWT, isAdmin } from "../middleware/verifyJWT.js";
const brandRouter = express.Router();

/* admin routes */
brandRouter.route("/createBrand").post(verifyJWT, isAdmin, createBrand);
brandRouter.route("/updateBrand").put(verifyJWT, isAdmin, updateBrand);
brandRouter.route("/deleteBrand").delete(verifyJWT, isAdmin, deleteBrand);

/* public routes */
brandRouter.route("/getAllBrand").get(getAllBrand);
brandRouter.route("/getSingleBrand/:_id").get(getSingleBrand);

export default brandRouter;
