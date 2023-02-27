import mongoose from "mongoose";

mongoose.set("strictQuery", true);
export const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("connected to Mongo DB");
  } catch (error) {
    throw error;
  }
};
