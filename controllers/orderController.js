import Order from "../models/orderModel.js";
import asyncHandler from "express-async-handler";
import HttpError from "../utils/extendedError.js";
import uniqid from "uniqid";
import Product from "../models/productModel.js";
import Cart from "../models/cartModel.js";

// @desc create order
// @route POST /createOrder
// @access private
export const createOrder = asyncHandler(async (req, res) => {
  /* confirm data */
  const { paymentMethod } = req.body;
  if (!paymentMethod) throw new HttpError("paymentMethod is required!", 400);

  const user = req.user;

  /* getting required cart info */
  const { totalPriceAfterDiscount, products } = await Cart.findOne({
    orderBy: user._id.toString(),
  });

  /* create new order */
  const order = await Order.create({
    products: products,
    paymentIntent: {
      id: uniqid(),
      method: paymentMethod,
      amount: totalPriceAfterDiscount,
      created: Date.now(),
      currency: "usd",
    },
    orderby: user._id,
  });

  /* update quantity and sold property of sold products  */
  const update = products.map(({ product, count }) => {
    return {
      updateOne: {
        filter: { _id: product._id },
        update: { $inc: { quantity: -count, sold: +count } },
      },
    };
  });
  await Product.bulkWrite(update);

  res.json({ message: "Order successfully submitted" });
});

// @desc get user orders
// @route GET /getUserOrders
// @access private
export const getUserOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const orders = await Order.find({ orderBy: _id }).populate(
    "products.product"
  );

  /* confirm orders */
  if (orders.length === 0) throw new HttpError("No order found!", 400);
  res.json(orders);
});

// @desc get all orders
// @route POST /getAllOrders
// @access private
export const getAllOrders = asyncHandler(async (req, res) => {
  const Orders = await Order.find()
    .populate("products.product")
    .populate("orderby")
    .exec();

  res.json(Orders);
});

// @desc get order by userId
// @route GET /getOrderByUserId
// @access private
export const getOrderByUserId = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  const orders = await Order.find({ orderBy: _id })
    .populate("products.product")
    .populate("orderby")
    .exec();

  /* check orders */
  if (orders.length === 0) throw new HttpError("No order found", 400);
  res.json(orders);
});

// @desc update order status
// @route PUT /updateOrderStatus
// @access private
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, orderId } = req.body;
  if ((!status, !orderId))
    throw new HttpError("Status and orderId are required!", 400);

  const updateOrderStatus = await Order.findByIdAndUpdate(
    orderId,
    {
      orderStatus: status,
    },
    { new: true }
  );
  res.json(updateOrderStatus);
});
