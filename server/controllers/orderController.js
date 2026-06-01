const { Menu } = require("../models/menuModel");
const { Order } = require("../models/orderModel");
const { Restaurant } = require("../models/restModel");
const { User } = require("../models/userModel");
const { Cart } = require("../models/cartModel");

// create order
const createOrder = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const cart = await Cart.findOne({ user: user._id }).populate({
      path: "items.menuItem",
      select: "price restaurantId name",
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Cart is empty or not found" });
    }

    // Group cart items by restaurant
    const itemsByRestaurant = cart.items.reduce((acc, item) => {
      if (item.menuItem && item.menuItem.restaurantId) {
        const restaurantId = item.menuItem.restaurantId.toString();
        if (!acc[restaurantId]) {
          acc[restaurantId] = [];
        }
        acc[restaurantId].push(item);
      }
      return acc;
    }, {});

    const orders = [];
    for (const restaurantId in itemsByRestaurant) {
      const items = itemsByRestaurant[restaurantId];
      if (items.length === 0) continue;

      let restaurantTotal = 0;
      const validatedItems = items.map((item) => {
        const price = item.price;
        if (
          isNaN(price) ||
          price <= 0 ||
          isNaN(item.quantity) ||
          item.quantity <= 0
        ) {
          throw new Error("Invalid item price or quantity");
        }
        restaurantTotal += price * item.quantity;
        return {
          restaurant: restaurantId,
          menuItem: item.menuItem._id,
          quantity: item.quantity,
          price: price,
        };
      });

      const newOrder = new Order({
        user: user._id,
        items: validatedItems,
        totalAmount: restaurantTotal,
        paymentStatus: "pending",
        orderStatus: "pending",
      });

      await newOrder.save();

      // Push order to user and restaurant
      const restaurant = await Restaurant.findById(restaurantId);
      if (restaurant) {
        if (!restaurant.orders) {
          restaurant.orders = [];
        }
        restaurant.orders.push(newOrder._id);
        await restaurant.save();
      }

      if (!user.orders) {
        user.orders = [];
      }
      user.orders.push(newOrder._id);
      orders.push(newOrder);
    }

    // Clear the cart
    await Cart.deleteOne({ _id: cart._id });
    await user.save();

    res.status(200).json({
      success: true,
      message: "Orders created successfully",
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// get order by id
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate({
        path: "user",
        select: "name email phone profilePic",
      })
      .populate({
        path: "items.restaurant",
        select: "name address phone cuisine rating description",
      })
      .populate({
        path: "items.menuItem",
      });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.status(200).json({ success: true, message: "Order details fetched", order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// cancel order
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    if (order.orderStatus === "delivered") {
      return res
        .status(400)
        .json({ success: false, message: "Cannot cancel a delivered order" });
    }
    // change status to cancelled
    order.orderStatus = "cancelled";
    await order.save();

    res
      .status(200)
      .json({ success: true, message: "Order cancelled successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// get all orders by user
const myOrders = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const orders = await Order.find({ user: user._id })
      .populate({
        path: "items.restaurant",
        select: "name address phone cuisine rating description",
      })
      .populate({
        path: "items.menuItem",
      });

    res.status(200).json({
      success: true,
      message: "My orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// list all orders (for admin)
const listAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate({
        path: "user",
        select: "name email phone",
      })
      .populate({
        path: "items.restaurant",
        select: "name address phone",
      })
      .populate({
        path: "items.menuItem",
      });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createOrder, myOrders, getOrderById, cancelOrder, listAllOrders };