import { useState, useMemo, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import CategoryRail from "../components/CategoryRail";
import RestaurantCard from "../components/RestaurantCard";
import RestaurantDetailsModal from "../components/RestaurantDetailsModal";
import CartModal from "../components/CartModal";
import TableBookingModal from "../components/TableBookingModal";
import SignupModal from "../components/SignupModal";
import LoginModal from "../components/LoginModal";

// Import cuisine images
import BiryaniImg from '../assets/Biryani.avif';
import BurgerImg from '../assets/Burger.avif';
import ChickenImg from '../assets/Chicken.avif';
import DosaImg from '../assets/Dosa.avif';
import FriedriceImg from '../assets/Friedrice.avif';
import PizzaImg from '../assets/Pizza.avif';
import SweetsImg from '../assets/Sweets.avif';
import VegMealsImg from '../assets/Veg Meals.avif';
import allRestaurants from "./allRestaurants";

// Cuisine image mapping
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

// ...parseJwt and allRestaurants as in your original code...

const cuisines = [
  "Biryani",
  "Burger",
  "Chicken",
  "Dosa",
  "Friedrice",
  "Pizza",
  "Sweets",
  "Veg Meals",
];

  export default function Home() {
  const railRef = useRef(null);
  const [tab, setTab] = useState("dining");
  const [selectedCuisine, setSelectedCuisine] = useState(null);
  const [user, setUser] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [loginPrompt, setLoginPrompt] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      window.history.replaceState({}, document.title, "/");
      localStorage.setItem("token", token);
      const payload = parseJwt(token);
      if (payload) {
        setUser({
          name: payload.name,
          email: payload.email,
          photo: payload.photo,
          id: payload.userId || payload.sub,
        });
      } else {
        setUser(null);
      }
    } else {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        const payload = parseJwt(storedToken);
        if (payload) {
          setUser({
            name: payload.name,
            email: payload.email,
            photo: payload.photo,
            id: payload.userId || payload.sub,
          });
        } else {
          setUser(null);
        }
      }
    }
  }, []);

  const filteredRestaurants = useMemo(() => {
    let list = allRestaurants.filter((r) =>
      tab === "dining" ? r.dineIn : r.delivery
    );
    if (tab === "delivery" && selectedCuisine) {
      list = list.filter((r) => r.cuisines.includes(selectedCuisine));
    }
    return list;
  }, [tab, selectedCuisine]);

  function handleBookTable(restaurant) {
    setSelectedRestaurant(restaurant);
    setShowTableModal(true);
  }

  function handleViewDetails(restaurant) {
    setSelectedRestaurant(restaurant);
    setShowDetailsModal(true);
  }

  function handleAddToCart(restaurant, item) {
    if (!item) return;
    const id = `${restaurant.id}-${item.id}`;
    setCart((prev) => {
      const existing = prev.find((ci) => ci.id === id);
      if (existing) {
        return prev.map((ci) =>
          ci.id === id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [
        ...prev,
        {
          id,
          restaurantName: restaurant.name,
          itemName: item.name,
          price: item.price,
          quantity: 1,
        },
      ];
    });
    setShowCart(true);
  }

  function updateQuantity(id, delta) {
    setCart((prev) =>
      prev
        .map((ci) =>
          ci.id === id
            ? { ...ci, quantity: Math.max(1, ci.quantity + delta) }
            : ci
        )
        .filter((ci) => ci.quantity > 0)
    );
  }

  function removeFromCart(id) {
    setCart((prev) => prev.filter((ci) => ci.id !== id));
  }

  function getSubtotal() {
    return cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }
  function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error parsing JWT:', e);
      return null;
    }
}

  return (
    <div>
      <Navbar
        user={user}
        onCartClick={() => setShowCart(true)}
        onLoginClick={() => setShowLogin(true)}
        onSignupClick={() => setShowSignup(true)}
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        onLogoutClick={() => {
          setUser(null);
          localStorage.removeItem("token");
        }}
        onEditProfile={() => {
          console.log("Edit profile clicked");
        }}
        onOrders={() => {
          console.log("Orders clicked");
        }}
      />

      <Hero
        onBook={() => setTab("dining")}
        onOrder={() => setTab("delivery")}
      />

      <div className="flex justify-center gap-10 border-b border-black/10 mb-10">
        {["dining", "delivery"].map((key) => (
          <button
            key={key}
            onClick={() => {
              setTab(key);
              setSelectedCuisine(null);
            }}
            className={`pb-3 text-lg font-medium transition ${
              tab === key
                ? "text-black border-b-2 border-black"
                : "text-black/50 hover:text-black"
            }`}
          >
            {key === "dining" ? "Dining Out" : "Delivery"}
          </button>
        ))}
      </div>

      {/* Category/Cuisine Rail with Images */}
      {tab === "delivery" && (
        <div
          className="flex items-center overflow-x-auto gap-6 mb-10 px-4"
          ref={railRef}
        >
          {cuisines.map((cuisine) => (
            <button
              key={cuisine}
              onClick={() => setSelectedCuisine(cuisine)}
              className={`flex flex-col items-center min-w-[80px] px-2 focus:outline-none transition ${
                selectedCuisine === cuisine
                  ? "border-b-2 border-black"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={cuisineImages[cuisine]}
                alt={cuisine}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 12,
                  border:
                    selectedCuisine === cuisine
                      ? "2px solid #000"
                      : "2px solid transparent",
                  boxShadow:
                    selectedCuisine === cuisine
                      ? "0 2px 8px rgba(0,0,0,0.11)"
                      : undefined,
                  objectFit: "cover",
                  marginBottom: 6,
                }}
              />
              <span className="text-sm">{cuisine}</span>
            </button>
          ))}
        </div>
      )}

      {tab === "delivery" && selectedCuisine && (
        <div className="flex items-center gap-3 mb-6 bg-black/5 px-4 py-3 rounded-lg max-w-3xl mx-auto">
          <span className="text-lg">
            Showing delivery options for <strong>{selectedCuisine}</strong>
          </span>
          <button
            onClick={() => setSelectedCuisine(null)}
            className="ml-auto text-sm underline hover:no-underline"
          >
            Clear filter
          </button>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4">
        <AnimatePresence>
          {filteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRestaurants.map((r) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -25 }}
                  transition={{ duration: 0.3 }}
                >
                  <RestaurantCard
                    spot={r}
                    onBook={() => handleBookTable(r)}
                    onDetails={() => handleViewDetails(r)}
                    onAddToCart={(item) => handleAddToCart(r, item)}
                    user={user}
                    setLoginPrompt={setLoginPrompt}
                    setShowLogin={setShowLogin}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 25 }}
              className="p-10 text-center text-lg text-gray-500"
            >
              No restaurants found for this selection.
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <RestaurantDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        restaurant={selectedRestaurant}
        addToCart={handleAddToCart}
        handleBookTable={handleBookTable}
      />

      {showTableModal && (
        <TableBookingModal
          isOpen={showTableModal}
          onClose={() => setShowTableModal(false)}
          restaurant={selectedRestaurant}
        />
      )}

      {showCart && (
        <CartModal
          isOpen={showCart}
          onClose={() => setShowCart(false)}
          cart={cart}
          setCart={setCart}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          getSubtotal={getSubtotal}
        />
      )}

      {showLogin && (
        <LoginModal
          isOpen={showLogin}
          onClose={() => setShowLogin(false)}
          onSignupClick={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
          setUser={setUser}
        />
      )}

      {showSignup && (
        <SignupModal
          isOpen={showSignup}
          onClose={() => setShowSignup(false)}
          onSwitchToLogin={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
          setUser={setUser}
        />
      )}
      {loginPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-8 text-center">
            <p className="mb-4 font-semibold text-lg text-black">Please login to add items to cart.</p>
            <button
              onClick={() => setLoginPrompt(false)}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-black/80"
            >
              OK
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
