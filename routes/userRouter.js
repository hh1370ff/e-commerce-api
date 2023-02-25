import express from "express";
import {
  createUser,
  deleteUser,
  forgotPassword,
  getAllUsers,
  getSingleUser,
  updateUser,
  resetPassword,
} from "../controllers/userController.js";
import { isAdmin, verifyJWT } from "../middleware/verifyJWT.js";
const userRouter = express.Router();

userRouter.route("/register").post(createUser);
userRouter.route("/getAllUsers").get(getAllUsers);
userRouter.route("/getSingleUser/:_id").get(getSingleUser);
userRouter.route("/deleteUser").delete(verifyJWT, isAdmin, deleteUser);
userRouter.route("/updateUser").put(updateUser);
userRouter.route("/forgotPassword").post(forgotPassword);
userRouter.route("/restPassword/:token").post(resetPassword);

export default userRouter;
