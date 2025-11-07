import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function CartModal({
  isOpen,
  onClose,
  cart,
  setCart, // ADD THIS PROP
  updateQuantity,
  removeFromCart,
  getSubtotal,
}) {
  const [step, setStep] = useState("cart");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [payment, setPayment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const DELIVERY_FEE = 40;
  const TAX_RATE = 0.05;
  const taxes = Math.round(getSubtotal() * TAX_RATE);
  const total = getSubtotal() + DELIVERY_FEE + taxes;

  useEffect(() => {
    if (step === "done") {
      const t = setTimeout(() => {
        setStep("cart");
        onClose();
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [step, onClose]);

  // Handle order submission
  const handlePayment = async () => {
    if (!payment) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login to place order");
        setIsSubmitting(false);
        return;
      }

      // Prepare order data matching backend schema
      const orderData = {
        items: cart.map((item) => ({
          restaurantId: item.id.split("-")[0], // Extract restaurant ID from composite ID
          restaurantName: item.restaurantName,
          itemName: item.itemName,
          quantity: item.quantity,
          price: item.price,
        })),
        total: total,
        address: address,
        phone: phone,
        paymentMethod: payment,
      };

      console.log("Submitting order:", orderData);

      const response = await fetch("https://foodo-app-backend.onrender.com/api/orders", {

        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to place order");
      }

      const result = await response.json();
      console.log("Order placed successfully:", result);

      // Show success step
      setStep("done");

      // Clear cart after successful order
      setTimeout(() => {
        setCart([]);
        setAddress("");
        setPhone("");
        setPayment(null);
      }, 2000);
    } catch (error) {
      console.error("Error placing order:", error);
      setError(error.message || "Failed to place order. Please try again.");
      alert("Failed to place order: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const BackButton = ({ to = "cart" }) => (
    <button
      onClick={() => setStep(to)}
      className="text-2xl leading-none px-2 rounded hover:bg-black/5"
      aria-label="Back"
    >
      ‹
    </button>
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        onClick={() => {
          setStep("cart");
          onClose();
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
      />
      <motion.div
        initial={{ x: 320, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 320, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed right-0 top-0 h-full w-[360px] md:w-[420px] bg-white shadow-2xl z-50 flex flex-col"
      >
        {/* SUCCESS STEP */}
        {step === "done" && (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-6xl mb-4"
            >
              ✅
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
            <p className="text-gray-600 mb-6">
              Your order has been placed successfully.
            </p>
            <div className="w-full bg-black/5 rounded-lg p-4 space-y-1 text-sm">
              {cart.map((i) => (
                <div key={i.id} className="flex justify-between">
                  <span>
                    {i.itemName} × {i.quantity}
                  </span>
                  <span>₹{i.price * i.quantity}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-black/20 flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">Closing in 3 seconds…</p>
          </div>
        )}

        {/* PAYMENT STEP */}
        {step === "payment" && (
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-black/10 flex items-center justify-between">
              <BackButton to="checkout" />
              <h2 className="text-xl font-bold">Payment</h2>
              <button
                onClick={() => {
                  setStep("cart");
                  onClose();
                }}
                className="text-2xl text-black/50 hover:text-black"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              {error && (
                <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="bg-black/5 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Order Summary</h3>
                <div className="space-y-1 text-sm">
                  {cart.map((i) => (
                    <div key={i.id} className="flex justify-between">
                      <span>
                        {i.itemName} × {i.quantity}
                      </span>
                      <span>₹{i.price * i.quantity}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm">
                    <span>Items</span>
                    <span>₹{getSubtotal()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivery Fee</span>
                    <span>₹{DELIVERY_FEE}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taxes</span>
                    <span>₹{taxes}</span>
                  </div>
                  <div className="pt-2 border-t border-black/20 flex justify-between font-semibold">
                    <span>Total Amount</span>
                    <span>₹{total}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Select Payment Method</h3>
                {[
                  { id: "upi", name: "UPI", icon: "📱" },
                  { id: "card", name: "Credit/Debit Card", icon: "💳" },
                  { id: "net", name: "Net Banking", icon: "🏦" },
                  { id: "cod", name: "Cash on Delivery", icon: "💵" },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPayment(m.id)}
                    disabled={isSubmitting}
                    className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 mb-3 transition ${
                      payment === m.id
                        ? "border-black bg-black text-white"
                        : "border-black/20 hover:border-black/40"
                    } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <span className="text-2xl">{m.icon}</span>
                    <span className="font-medium">{m.name}</span>
                    {payment === m.id && (
                      <span className="ml-auto text-sm">Selected</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-black/10">
              <button
                disabled={!payment || isSubmitting}
                onClick={handlePayment}
                className={`w-full py-3 rounded-lg font-semibold ${
                  payment && !isSubmitting
                    ? "bg-black text-white hover:bg-black/90"
                    : "bg-black/20 text-black/40 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  `Pay ₹${total}`
                )}
              </button>
            </div>
          </div>
        )}

        {/* CHECKOUT STEP */}
        {step === "checkout" && (
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-black/10 flex items-center justify-between">
              <BackButton to="cart" />
              <h2 className="text-xl font-bold">Checkout</h2>
              <button
                onClick={() => {
                  setStep("cart");
                  onClose();
                }}
                className="text-2xl text-black/50 hover:text-black"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              <div>
                <h3 className="font-semibold mb-2">Delivery Address</h3>
                <textarea
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your delivery address"
                  className="w-full p-3 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <h3 className="font-semibold mb-2">Contact Number</h3>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full p-3 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <h3 className="font-semibold mb-3">Order Items</h3>
                <div className="space-y-3">
                  {cart.map((i) => (
                    <div
                      key={i.id}
                      className="flex items-center justify-between p-3 bg-black/5 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{i.itemName}</p>
                        <p className="text-xs text-gray-600">
                          {i.restaurantName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{i.price * i.quantity}</p>
                        <p className="text-xs text-gray-600">Qty {i.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-black/5 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Item Total</span>
                  <span>₹{getSubtotal()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery Fee</span>
                  <span>₹{DELIVERY_FEE}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Taxes</span>
                  <span>₹{taxes}</span>
                </div>
                <div className="pt-2 border-t border-black/20 flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-black/10">
              <button
                disabled={!address || !phone}
                onClick={() => setStep("payment")}
                className={`w-full py-3 rounded-lg font-semibold ${
                  address && phone
                    ? "bg-black text-white hover:bg-black/90"
                    : "bg-black/20 text-black/40 cursor-not-allowed"
                }`}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        )}

        {/* CART STEP */}
        {step === "cart" && (
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-black/10 flex items-center justify-between">
              <h2 className="text-xl font-bold">Your Cart ({cart.length})</h2>
              <button
                onClick={() => onClose()}
                className="text-2xl text-black/50 hover:text-black"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="text-6xl mb-4">🛒</div>
                <h3 className="text-xl font-semibold mb-1">Your cart is empty</h3>
                <p className="text-gray-600 mb-6">Add items to get started</p>
                <button
                  onClick={() => onClose()}
                  className="px-6 py-3 bg-black text-white rounded-lg hover:bg-black/90 transition"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {cart.map((i) => (
                    <div
                      key={i.id}
                      className="bg-white border border-black/10 rounded-lg p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <h4 className="font-semibold">{i.itemName}</h4>
                          <p className="text-sm text-gray-600">
                            {i.restaurantName}
                          </p>
                          <p className="font-bold mt-1">₹{i.price}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(i.id)}
                          className="text-red-500 hover:text-red-600 font-bold text-xl"
                          aria-label="Remove"
                        >
                          ×
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3 border border-black/20 rounded-lg">
                          <button
                            onClick={() => updateQuantity(i.id, -1)}
                            className="px-3 py-1 hover:bg-black/5"
                          >
                            −
                          </button>
                          <span className="font-semibold">{i.quantity}</span>
                          <button
                            onClick={() => updateQuantity(i.id, 1)}
                            className="px-3 py-1 hover:bg-black/5"
                          >
                            +
                          </button>
                        </div>
                        <p className="font-bold text-lg">
                          ₹{i.price * i.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-6 border-t border-black/10 space-y-4">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Subtotal</span>
                    <span>₹{getSubtotal()}</span>
                  </div>
                  <button
                    onClick={() => setStep("checkout")}
                    className="w-full bg-black text-white py-3 rounded-lg font-semibold text-lg hover:bg-black/90 transition"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
