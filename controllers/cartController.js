import Cart from "../models/cartModel.js";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import HttpError from "../utils/extendedError.js";

/* to use this function you should pass productId count color price in the body */
// @desc create cart
// @route POST /createCart
// @access private
export const createCart = asyncHandler(async (req, res) => {
  let { products } = req.body;
  const user = req.user;

  if (!products || products.length === 0)
    throw new HttpError("All fields are required", 400);

  const cartExist = await Cart.findOne({ orderBy: user._id });
  if (cartExist) {
    cartExist.deleteOne();
  }

  /* adding price and calculating the total price */
  let totalPrice = 0;
  products = await Promise.all(
    products.map(async ({ productId, count, color }) => {
      const { price } = await Product.findById(productId);
      totalPrice += price * count;
      return {
        count,
        color,
        product: productId,
        price,
      };
    })
  );

  const cart = await Cart.create({ products, totalPrice, orderBy: user._id });
  res.json(cart);
});

export const getCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const cart = await Cart.findOne({ orderBy: _id }).populate("products");
  if (!cart) throw new HttpError("Cart not found!", 400);
  res.json(cart);
});

export const deleteCart = asyncHandler(async (req, res) => {
  const user = req.user;

  /* check cart */
  const cart = await Cart.findOne({ orderBy: user._id });
  if (!cart) throw new HttpError("Cart not found", 400);

  cart.delete();
  res.json(cart);
});
