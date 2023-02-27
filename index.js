import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/userRouter.js";
import { dbConnect } from "./config/dbConnect.js";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandler.js";
import notFound from "./middleware/notFound.js";
import authRouter from "./routes/authRouter.js";
import productRouter from "./routes/productRouter.js";
import blogRouter from "./routes/blogRouter.js";
import productCategoryRouter from "./routes/productCategoryRouter.js";
import enquiryRouter from "./routes/enquiryRouter.js";
import couponRouter from "./routes/couponRouter.js";
const app = express();

dotenv.config();

const PORT = process.env.PORT || 3500;

app.use(express.json());
app.use(cookieParser());

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/productCategory", productCategoryRouter);
app.use("/api/enquiry", enquiryRouter);
app.use("/api/coupon", couponRouter);

app.use(notFound);
app.use(errorHandler);
app.listen(PORT, async () => {
  try {
    await dbConnect();
  } catch (error) {
    throw error;
  }

  console.log(`Server is running on port ${PORT}`);
});
