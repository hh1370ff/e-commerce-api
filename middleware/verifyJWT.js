import jwt from "jsonwebtoken";

export const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer "))
    throw new Error("Not authorized", 401);
  const accessToken = authHeader.split(" ")[1];
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
    if (err) throw new Error("unAuthorized", 403);
    req.roles = decode.userInfo.roles;
    req.useName = decode.userInfo.useName;
    next();
  });
};

export const isAdmin = (req, res, next) => {
  if (!req.roles?.includes("admin")) throw new Error("You are not admin", 401);
  next();
};
