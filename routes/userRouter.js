import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getSingleUser,
  updateUser,
} from "../controllers/userController.js";
import { isAdmin, verifyJWT } from "../middleware/verifyJWT.js";
const userRouter = express.Router();

userRouter.route("/register").post(createUser);
userRouter.route("/getAllUsers").get(getAllUsers);
userRouter.route("/getSingleUser/:_id").get(getSingleUser);
userRouter.route("/deleteUser").delete(verifyJWT, isAdmin, deleteUser);
userRouter.route("/updateUser").put(updateUser);

export default userRouter;
