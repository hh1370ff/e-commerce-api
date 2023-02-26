import mongoose from "mongoose";

var productCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const ProductCategory = mongoose.model("PCategory", productCategorySchema);

export default ProductCategory;
