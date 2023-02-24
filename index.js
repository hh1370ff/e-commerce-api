import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/userRouter.js";
import { dbConnect } from "./config/dbConnect.js";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandler.js";
import notFound from "./middleware/notFound.js";
import authRouter from "./routes/authRouter.js";
import productRouter from "./routes/productRouter.js";

const app = express();

dotenv.config();

const PORT = process.env.PORT || 3500;

app.use(express.json());
app.use(cookieParser());

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);

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
