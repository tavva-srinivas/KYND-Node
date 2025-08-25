const Order = require("../model/order.model");
const Product = require("../model/product.model");
const DietPlan = require("../model/dietPlan.model");


 // 1. Place a new order
exports.placeOrder = async (req, res) => {
  try {
    const {
      type,          // "Product" | "DietPlan"
      productId,     // Product or DietPlan id
      startDate,
      endDate,
      quantity,
      address,
      receiverName,
      contactInfo,
      house_details,
      instructions,
      time
    } = req.body;

    const customer_id = req.user._id; // comes from auth middleware

    // validate product or diet plan exists
    let productData = null;
    if (type === "product") {
      productData = await Product.findById(productId);
    } else if (type === "meal_plan") {
      productData = await DietPlan.findById(productId);
    }

    if (!productData) {
      return res.status(404).json({ error: "Invalid product/meal plan ID" });
    }

    const newOrder = new Order({
      customer_id,
      type,
      productId,
      startDate,
      endDate,
      quantity,
      address,
      receiverName,
      contactInfo,
      house_details,
      instructions,
      time,
      status: "pending"
    });

    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (err) {
    console.error("Error in placeOrder:", err);
    res.status(500).json({ error: err.message });
  }
};


 // 2. Get all orders for logged-in user
exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ customer_id: userId })
      .populate("customer_id", "name email preferences")
      .populate({
        path: "productId",
        populate: { path: "items", model: "Product", select: "name category price" }
      });

    res.json({ orders });
  } catch (err) {
    console.error("Error in getMyOrders:", err);
    res.status(500).json({ error: err.message });
  }
};

 // 3. Get all active orders (admin/chef)
 
exports.getActiveOrders = async (req, res) => {
  try {
    const today = new Date();

    const activeOrders = await Order.find({
      startDate: { $lte: today },
      endDate: { $gte: today }
    })
      .populate("customer_id", "name preferences email")
      .populate({
        path: "productId",
        populate: { path: "items", model: "Product", select: "name category price" }
      });

    const groupedOrders = {};

    activeOrders.forEach(order => {
      const start = new Date(order.startDate);
      const end = new Date(order.endDate);

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateKey = d.toISOString().split("T")[0];
        if (!groupedOrders[dateKey]) groupedOrders[dateKey] = [];

        let productsToCook = [];

        if (order.type === "product") {
          productsToCook.push({
            name: order.productId?.name,
            category: order.productId?.category,
            quantity: order.quantity || 1
          });
        } else if (order.type === "meal_plan" && order.productId?.items?.length > 0) {
          order.productId.items.forEach(prod => {
            productsToCook.push({
              name: prod.name,
              category: prod.category,
              quantity: 1
            });
          });
        }

        groupedOrders[dateKey].push({
          orderId: order._id,
          customer: {
            _id: order.customer_id._id,
            name: order.customer_id.name,
            preferences: order.customer_id.preferences
          },
          time: order.time,
          products: productsToCook,
          address: order.address,
          instructions: order.instructions,
          status: order.status
        });
      }
    });

    const response = Object.entries(groupedOrders).map(([date, orders]) => ({
      date,
      orders
    }));

    res.json({ groupedOrders: response });
  } catch (err) {
    console.error("Error in getActiveOrders:", err);
    res.status(500).json({ error: err.message });
  }
};


 // 4. Update order status (delivered, completed, canceled)
 
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body; // e.g. "delivered", "completed", "canceled"

    if (!["pending", "delivered", "completed", "canceled"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ message: "Order status updated successfully", order });
  } catch (err) {
    console.error("Error in updateOrderStatus:", err);
    res.status(500).json({ error: err.message });
  }
};
