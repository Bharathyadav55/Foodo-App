import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function RestaurantDetailsModal({ isOpen, onClose, restaurant, addToCart, handleBookTable }) {
  const [tab, setTab] = useState("Overview");

  if (!isOpen || !restaurant) return null;

  const photos =
    Array.isArray(restaurant.photos) && restaurant.photos.length
      ? restaurant.photos
      : (restaurant.menuItems || []).map(item => item.image).filter(Boolean);

  return (
    <AnimatePresence>
      <motion.div
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
      />
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 24, opacity: 0 }}
        className="fixed inset-0 m-auto max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-y-auto z-50"
      >
        {/* Photos */}
        <div className="w-full h-64 overflow-hidden">
          <div className="flex space-x-2 overflow-x-auto p-2">
            {photos?.length
              ? photos.map((src, i) => (
                  <img key={i} src={src} alt={`Photo ${i + 1}`} className="h-60 rounded-lg object-cover flex-shrink-0" />
                ))
              : (
                  <div className="h-60 w-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">No photos</span>
                  </div>
                )
            }
          </div>
        </div>

        {/* Address & actions */}
        <div className="p-6 border-b border-black/10">
          <h2 className="text-2xl font-bold">{restaurant.name}</h2>
          {restaurant.address && <p className="text-sm text-gray-600 mt-1">{restaurant.address}</p>}
          <div className="mt-4 flex gap-3">
            {restaurant.dineIn && (
              <button onClick={() => handleBookTable(restaurant)} className="px-4 py-2 bg-black text-white rounded-lg">Book Table</button>
            )}
            {restaurant.delivery && (
              <button onClick={() => addToCart(restaurant, null, true)} className="px-4 py-2 border border-black rounded-lg">Order</button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="p-6">
          <div className="flex border-b border-black/10 mb-4">
            {["Overview", "Menu", "Reviews", "Photos"].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2 ${tab === t ? "border-b-2 border-black font-semibold" : "text-gray-600 hover:text-black"}`}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === "Overview" && (
            <p className="text-gray-700">{restaurant.description || "No overview available."}</p>
          )}
          {tab === "Menu" && (
            <div className="space-y-4">
              {(restaurant.menuItems || []).map(item => (
                <div key={item.id} className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{item.name}</p>
                    {item.bestseller && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-orange-100 text-orange-700">Bestseller</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-bold">₹{item.price}</p>
                    </div>
                    <button onClick={() => addToCart(restaurant, item, true)} className="px-3 py-1 bg-black text-white rounded-lg">ADD</button>
                  </div>
                </div>
              ))}
              {!(restaurant.menuItems || []).length && (<p className="text-sm text-gray-500">Menu not available.</p>)}
            </div>
          )}
          {tab === "Reviews" && (
            <div className="space-y-4">
              {(restaurant.reviews || []).length
                ? (restaurant.reviews.map((rev, i) => (
                    <div key={i} className="border-b border-black/10 pb-4">
                      <p className="font-semibold">{rev.user}</p>
                      <p className="text-sm text-gray-600">{rev.comment}</p>
                    </div>
                  )))
                : (<p className="text-gray-600">No reviews yet.</p>)
              }
            </div>
          )}
          {tab === "Photos" && (
            <div className="grid grid-cols-2 gap-2">
              {photos?.length
                ? photos.map((src, i) => (
                    <img key={i} src={src} alt={`Photo ${i + 1}`} className="w-full h-32 object-cover rounded-lg"/>
                  ))
                : <p className="text-sm text-gray-500">No photos.</p>
              }
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
