import React, { useState } from "react";
import FoodooLogo from '../assets/FoodooLogo.png'; // Adjust the path if needed


export default function Navbar({
  user,
  onCartClick,
  onLoginClick,
  onSignupClick,
  cartCount,
  onLogoutClick,
  onEditProfile,
  onOrders
}) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="sticky top-0 z-30 bg-white border-b border-black/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src={FoodooLogo}
            alt="Foodoo Logo"
            className="h-8 w-8 rounded-lg object-cover shadow"
          />
          <span className="text-xl font-semibold tracking-wide">Foodoo</span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-6">
          {/* Cart */}
          <button onClick={onCartClick} className="relative">
            <span className="text-2xl">🛒</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Profile or Login */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2"
              >
                {/* Show profile photo or fallback icon */}
                {user.photo ? (
                  <img
                    src={user.photo}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center font-semibold">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <span>▼</span>
              </button>

              {/* Dropdown */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-black/10 py-2">
                  <button
                    onClick={() => {
                      onEditProfile?.();
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-black/5"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => {
                      onOrders?.();
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-black/5"
                  >
                    My Orders
                  </button>
                  <button
                    onClick={() => {
                      onLogoutClick?.();
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-black/5 text-red-600"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-black/90"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
