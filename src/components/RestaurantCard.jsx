import React, { useState } from "react";
import BiryaniImg from '../assets/Biryani.avif';
import BurgerImg from '../assets/Burger.avif';
import ChickenImg from '../assets/Chicken.avif';
import DosaImg from '../assets/Dosa.avif';
import FriedriceImg from '../assets/Friedrice.avif';
import PizzaImg from '../assets/Pizza.avif';
import SweetsImg from '../assets/Sweets.avif';
import VegMealsImg from '../assets/Veg Meals.avif';

// Cuisine-to-image mapping
const cuisineImages = {
  "Biryani": BiryaniImg,
  "Burger": BurgerImg,
  "Chicken": ChickenImg,
  "Dosa": DosaImg,
  "Friedrice": FriedriceImg,
  "Pizza": PizzaImg,
  "Sweets": SweetsImg,
  "Veg Meals": VegMealsImg
};

export default function RestaurantCard({
  spot,
  onBook,
  onDetails,
  onAddToCart,
  user,
  setLoginPrompt,
  setShowLogin
}) {
  const [showMenu, setShowMenu] = useState(false);

  // Use photo if available, else fallback to first cuisine image
  const mainImage =
    (spot.photos && spot.photos.length && spot.photos[0]) ||
    (spot.cuisines && cuisineImages[spot.cuisines[0]]) ||
    PizzaImg;

  return (
    <article className="bg-white border border-black/10 rounded-2xl overflow-hidden group hover:shadow-xl transition">
      {/* Show restaurant/cuisine photo */}
      <div className="aspect-[16/9] w-full bg-gradient-to-br from-black/5 to-black/10 group-hover:opacity-90 transition flex items-center justify-center">
        <img
          src={mainImage}
          alt={spot.cuisines?.[0] || "Restaurant"}
          className="object-cover w-full h-full"
          style={{ maxHeight: "192px" }}
        />
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{spot.name}</h3>
          {spot.rating && <span className="text-sm text-black/70">{spot.rating}</span>}
        </div>
        <p className="mt-1 text-sm text-black/70">
          {(spot.time ? `${spot.time} • ` : "") + (spot.price || "")}
        </p>
        <p className="mt-1 text-xs text-black/50">
          {(spot.cuisines || []).join(", ")}
        </p>
        <div className="mt-2 flex gap-2">
          {spot.delivery && <span className="text-xs bg-black/5 px-2 py-1 rounded">Delivery</span>}
          {spot.dineIn && <span className="text-xs bg-black/5 px-2 py-1 rounded">Dine-in</span>}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          {spot.delivery && (
            <button
              onClick={() => setShowMenu(s => !s)}
              className="rounded-lg bg-black text-white px-4 py-2 hover:bg-black/90 active:translate-y-px transition"
            >
              {showMenu ? "Hide Menu" : "View Menu"}
            </button>
          )}
          {spot.dineIn && (
            <button
              onClick={() => onBook?.(spot)}
              className="rounded-lg bg-black text-white px-4 py-2 hover:bg-black/90 active:translate-y-px transition"
            >
              Book Table
            </button>
          )}
          <button
            onClick={() => onDetails?.(spot)}
            className="px-3 py-2 rounded-lg hover:bg-black/5 active:translate-y-px transition"
          >
            Details
          </button>
        </div>
        {showMenu && (
          <div className="mt-4 pt-4 border-t border-black/10 space-y-3">
            {(spot.menuItems || []).map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 p-3 bg-black/0.02 rounded-lg hover:bg-black/5 transition">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{item.name}</p>
                    {item.bestseller && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-orange-100 text-orange-700">
                        Bestseller
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold">₹{item.price}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (!user) {
                      setLoginPrompt?.(true);
                      setShowLogin?.(true); // Optional: show login modal
                    } else {
                      onAddToCart?.(item);
                    }
                  }}
                  className="px-4 py-2 bg-white border-2 border-black text-black rounded-lg font-semibold hover:bg-black hover:text-white active:translate-y-px transition"
                >
                  ADD
                </button>
              </div>
            ))}
            {!(spot.menuItems || []).length && (
              <p className="text-sm text-gray-500">No menu items.</p>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
