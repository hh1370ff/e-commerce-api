import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import sendEmail from "../utils/sendEmail.js";
import HttpError from "../utils/extendedError.js";
import { cloudinaryUploadImg } from "../utils/cloudinary.js";
import encodeImageToBlurHash from "../utils/blurHash.js";

// @desc Create new product
// @route POST /createProduct
// @access Private
export const createProduct = asyncHandler(async (req, res) => {
  const { title, slug, description, price, brand, quantity } = req.body;

  // Confirm data
  if (!title || !slug || !description || !price || !brand || !quantity)
    throw new HttpError("All fields are required", 400);

  if (req.files.length === 0)
    throw new HttpError("Image is required are required", 400);

  const urlsPlusBlur = await Promise.all(
    req.files.map(async (file) => {
      const blurHash = await encodeImageToBlurHash(file, 300, 300);
      const { url } = await cloudinaryUploadImg(file);
      return { url, blurHash };
    })
  );

  const productObject = { ...req.body, images: urlsPlusBlur };

  // Create and store new product
  const product = await Product.create(productObject);

  res.status(201).json({ message: `New product ${title} created` });
});

// @desc Update a product
// @route PATCH /updateProduct
// @access Private
export const updateProduct = asyncHandler(async (req, res) => {
  const { _id, title, slug, description, price, brand, quantity } = req.body;

  // Confirm data
  if (!_id || !title || !slug || !description || !price || !brand || !quantity)
    throw new HttpError("All fields are required", 400);

  // Does the product exist to update?
  const product = await Product.findById(_id).exec();

  if (!product) {
    throw new HttpError("Product not found", 400);
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    product._id,
    { $set: req.body },
    { new: true }
  );

  res.json(updatedProduct);
});

// @desc Get all products
// @route GET /getAllproducts
// @access public
export const getAllProduct = asyncHandler(async (req, res) => {
  // Get all products from MongoDB
  const products = await Product.find().lean();

  // If no products
  if (!products?.length) {
    throw new HttpError("No products found", 400);
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
    throw new HttpError("Product ID Required", 400);
  }

  // Does the product exist to delete?
  const product = await Product.findById(_id).exec();

  if (!product) {
    throw new HttpError("Product not found", 400);
  }

  const result = await product.deleteOne();

  const reply = `Product${result.title} with ID ${result._id} deleted`;

  res.json(reply);
});

// @desc Get a singleProduct
// @route GET /singleProduct
// @access public
export const getSingleProduct = asyncHandler(async (req, res) => {
  sendEmail();
  const { _id } = req.params;

  // Confirm data
  if (!_id) throw new HttpError("ID is required", 400);

  // Get single product from MongoDB
  const product = await Product.findById(_id).lean();

  // If no product
  if (!product) {
    throw new HttpError("No products found", 400);
  }

  res.json(product);
});

// @desc add or remove from the wishlist
// @route POST /addRemoveFormWishlist
// @access private
export const addRemoveFormWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId } = req.body;

  if (!_id || !prodId) throw new HttpError("All fields are required!");

  //confirm data
  const user = await User.findById(_id);

  const product = await Product.findById(prodId);
  if (!user || !product) throw new HttpError("User or product not found", 400);

  // check current wishlist
  const itemExist = user.wishlist.find((itemId) => {
    return prodId === itemId.toString();
  });

  //remove the product from the wishlist if the item exist and add it if not
  if (itemExist === undefined) {
    await user.updateOne({ $push: { wishlist: prodId } });
  } else {
    await user.updateOne({ $pull: { wishlist: prodId } });
  }

  let message;
  if (itemExist === undefined) {
    message = "Item is added to the wishlist successfully";
  } else {
    message = "Item is removed from the wishlist successfully";
  }
  res.status(200).json({ message });
});

// @desc rate a product
// @route POST /rateProduct
// @access private
export const rateProduct = asyncHandler(async (req, res) => {
  const { star, comment, prodId } = req.body;

  /* confirm data */
  if (!star || !comment || !prodId)
    throw new HttpError("All fields are required", 400);

  const user = req.user;

  /* confirm product */
  let product = await Product.findById(prodId);
  if (!product) throw new HttpError("Product not found!", 400);

  /* finding the previous rate if exist */
  const previousRate = product.ratings.find(
    (rate) => rate.postedBy.toString() === user._id.toString()
  );
  console.log(
    "🚀 ~ file: productController.js:176 ~ rateProduct ~ previousRate:",
    previousRate
  );

  let message;
  if (previousRate === undefined) {
    // add the new rating

    product = await product.updateOne({
      $push: {
        ratings: {
          star,
          comment,
          postedBy: user.id,
        },
      },
    });
    message = "New rating is added";
  } else {
    // update the rating

    product = await Product.updateOne(
      {
        ratings: { $elemMatch: previousRate },
      },
      {
        $set: {
          "ratings.$.star": star,
          "ratings.$.comment": comment,
        },
      }
    );
    message = "New rating is edited";
  }

  /* update total rating */
  product = await Product.findById(prodId);
  const averageRating = product.ratings.reduce(
    (av, rate, index) => (av * index + rate.star) / (index + 1),
    0
  );

  await product.updateOne({
    totalRating: averageRating.toFixed(1),
  });

  res.status(200).json({ message });
});
