const express = require("express");
const jwt = require("jsonwebtoken");
const Order = require("../models/Order");
const router = express.Router();

// ========== Auth Middleware ==========
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: "No authorization header" });
  }
  
  const token = authHeader.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = decoded;
    next();
  });
}

// ========== Get logged-in user's orders ==========
router.get("/my", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .sort({ createdAt: -1 })
      .select('-__v');
    
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Server error fetching orders" });
  }
});

// ========== Create New Order ==========
router.post("/", auth, async (req, res) => {
  try {
    const { items, total, address, phone, paymentMethod } = req.body;
    
    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Order must contain at least one item" });
    }
    
    if (!total || total <= 0) {
      return res.status(400).json({ error: "Invalid order total" });
    }
    
    if (!address || address.trim() === "") {
      return res.status(400).json({ error: "Delivery address is required" });
    }
    
    // Validate each item structure
    for (const item of items) {
      if (!item.itemName || !item.restaurantName || !item.price || !item.quantity) {
        return res.status(400).json({ 
          error: "Each item must have itemName, restaurantName, price, and quantity" 
        });
      }
    }
    
    // Create order
    const order = await Order.create({
      user: req.user.userId,
      items,
      total,
      address,
      phone,
      paymentMethod: paymentMethod || 'cod',
      status: 'pending'
    });
    
    res.status(201).json({
      message: "Order created successfully",
      order
    });
    
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ 
      error: "Server error creating order",
      details: err.message 
    });
  }
});

// ========== Get single order by ID ==========
router.get("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.userId // Ensure user can only access their own orders
    });
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    res.json(order);
  } catch (err) {
    console.error("Error fetching order:", err);
    
    // Handle invalid ObjectId format
    if (err.name === 'CastError') {
      return res.status(400).json({ error: "Invalid order ID format" });
    }
    
    res.status(500).json({ error: "Server error fetching order" });
  }
});

// ========== Update order status ==========
router.patch("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    const validStatuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
    
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: "Invalid status",
        validStatuses 
      });
    }
    
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { 
        status,
        ...(status === 'delivered' ? { deliveredAt: new Date() } : {})
      },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    res.json({
      message: "Order status updated successfully",
      order
    });
    
  } catch (err) {
    console.error("Error updating order:", err);
    
    if (err.name === 'CastError') {
      return res.status(400).json({ error: "Invalid order ID format" });
    }
    
    res.status(500).json({ error: "Server error updating order" });
  }
});

// ========== Cancel order ==========
router.delete("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.userId
    });
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    // Only allow cancellation if order is pending or confirmed
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ 
        error: "Cannot cancel order in current status",
        currentStatus: order.status 
      });
    }
    
    order.status = 'cancelled';
    await order.save();
    
    res.json({
      message: "Order cancelled successfully",
      order
    });
    
  } catch (err) {
    console.error("Error cancelling order:", err);
    
    if (err.name === 'CastError') {
      return res.status(400).json({ error: "Invalid order ID format" });
    }
    
    res.status(500).json({ error: "Server error cancelling order" });
  }
});

module.exports = router;
