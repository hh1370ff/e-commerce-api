import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// @desc Login
// @route POST /auth
// @access Public
export const login = asyncHandler(async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    throw new Error("All fields are required", 400);
  }

  const foundUser = await User.findOne({ userName }).exec();

  if (!foundUser) {
    throw new Error("Unauthorized", 401);
  }

  const match = await bcrypt.compare(password, foundUser.password);

  if (!match) throw new Error("Unauthorized", 401);

  const accessToken = jwt.sign(
    {
      userInfo: {
        userName: foundUser.userName,
        roles: foundUser.roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  const refreshToken = jwt.sign(
    { userName: foundUser.userName },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  // Create secure cookie with refresh token
  res.cookie("jwt", refreshToken, {
    httpOnly: true, //accessible only by web server
    secure: true, //https
    sameSite: "None", //cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
  });

  // Send accessToken containing userName and roles
  res.json({
    accessToken,
    userName: foundUser.userName,
    roles: foundUser.roles,
  });
});

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
export const refresh = (req, res) => {
  const cookies = req.cookies;
  console.log("🚀 ~ file: authController.js:60 ~ refresh ~ cookies:", cookies);

  if (!cookies?.jwt) throw new Error("Unauthorized", 401);

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) throw new Error("Forbidden", 403);

      const foundUser = await User.findOne({
        userName: decoded.userName,
      }).exec();

      if (!foundUser) throw new Error("Unauthorized", 401);

      const { userName, roles } = foundUser;
      const accessToken = jwt.sign(
        {
          UserInfo: {
            userName: foundUser.userName,
            roles: foundUser.roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "7d" }
      );

      res.json({ accessToken, userName, roles });
    }
  );
};

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
export const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie cleared" });
};
