import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer "))
    throw new Error("Not authorized", 401);
  const accessToken = authHeader.split(" ")[1];
  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    async (err, decode) => {
      if (err) return next(new Error("unAuthorized", 403));
      try {
        const user = await User.findOne({ userName: decode.userInfo.userName });
        if (!user) throw new Error("User not found!", 400);
        req.user = user;
        next();
      } catch (error) {
        next(error);
      }
    }
  );
});

export const isAdmin = (req, res, next) => {
  try {
    if (!req.user?.roles?.includes("admin"))
      throw new Error("You are not admin", 401);
    next();
  } catch (error) {
    next(error);
  }
};
