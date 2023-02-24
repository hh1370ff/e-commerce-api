import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

// @desc Create new product
// @route POST /createProduct
// @access Private
export const createProduct = asyncHandler(async (req, res) => {
  const { title, slug, description, price, category, brand, quantity } =
    req.body;

  // Confirm data
  if (
    !title ||
    !slug ||
    !description ||
    !price ||
    !category ||
    !brand ||
    !quantity
  )
    throw new Error("All fields are required", 400);

  const productObject = { ...req.body };

  // Create and store new product
  const product = await Product.create(productObject);

  if (product)
    res.status(201).json({ message: `New product ${title} created` });
  else throw new Error("Invalid product data received", 400);
});

// @desc Update a product
// @route PATCH /updateProduct
// @access Private
export const updateProduct = asyncHandler(async (req, res) => {
  const { _id, title, slug, description, price, category, brand, quantity } =
    req.body;

  // Confirm data
  if (
    !_id ||
    !title ||
    !slug ||
    !description ||
    !price ||
    !category ||
    !brand ||
    !quantity
  )
    throw new Error("All fields are required", 400);

  // Does the product exist to update?
  const product = await Product.findById(_id).exec();

  if (!product) {
    throw new Error("Product not found", 400);
  }

  const updated = await product.update({ ...req.body });

  res.json({ message: `Item is updated` });
});

// @desc Get all products
// @route GET /getAllproducts
// @access Private
export const getAllProduct = asyncHandler(async (req, res) => {
  // Get all products from MongoDB
  const products = await Product.find().lean();

  // If no products
  if (!products?.length) {
    throw new Error("No products found", 400);
  }

  res.json(products);
});

// @desc Delete a product
// @route DELETE /deleteProduct
// @access Private
export const deleteProduct = asyncHandler(async (req, res) => {
  const { _id } = req.body;

  // Confirm data
  if (!_id) {
    throw new Error("Product ID Required", 400);
  }

  // Does the product exist to delete?
  const product = await Product.findById(_id).exec();

  if (!product) {
    throw new Error("Product not found", 400);
  }

  const result = await product.deleteOne();

  const reply = `Product${result.title} with ID ${result._id} deleted`;

  res.json(reply);
});

// @desc Get a singleProduct
// @route GET /singleProduct
// @access Private
export const getSingleProduct = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  // Confirm data
  if (!_id) throw new Error("ID is required", 400);

  // Get single product from MongoDB
  const product = await Product.findById(_id).lean();

  // If no product
  if (!product) {
    throw new Error("No products found", 400);
  }

  res.json(product);
});
