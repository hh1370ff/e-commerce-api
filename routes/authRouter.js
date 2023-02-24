import express from "express";
import { login, logout, refresh } from "../controllers/authController.js";
const authRouter = express.Router();

authRouter.route("/login").post(login);
authRouter.route("/refresh").get(refresh);
authRouter.route("/logout").post(logout);

export default authRouter;
