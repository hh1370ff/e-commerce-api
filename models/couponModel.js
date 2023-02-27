import mongoose from "mongoose";

var couponSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  expiry: {
    type: Date,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
});

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
