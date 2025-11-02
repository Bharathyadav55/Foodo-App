const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [{
    restaurantId: { type: String, required: true },
    restaurantName: { type: String, required: true },
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 }
  }],
  total: {
    type: Number,
    required: true,
    min: 0
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  paymentMethod: {
    type: String,
    enum: ['upi', 'card', 'net', 'cod'],
    default: 'cod'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  deliveredAt: {
    type: Date
  }
});

module.exports = mongoose.model("Order", OrderSchema);
