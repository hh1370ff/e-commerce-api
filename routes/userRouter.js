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
import { verifyJWT, isAdmin } from "../middleware/verifyJWT.js";
const userRouter = express.Router();
/* admin routes */
userRouter.route("/getAllUsers").get(verifyJWT, isAdmin, getAllUsers);

/* user routes */
userRouter.route("/getSingleUser").get(verifyJWT, getSingleUser);
userRouter.route("/deleteUser").delete(verifyJWT, deleteUser);
userRouter.route("/updateUser").put(verifyJWT, updateUser);

/* public route */
userRouter.route("/register").post(createUser);

userRouter.route("/forgotPassword").post(forgotPassword);
userRouter.route("/restPassword/:token").post(resetPassword);

export default userRouter;
