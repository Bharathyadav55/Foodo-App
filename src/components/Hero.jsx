import React from "react";

export default function Hero({ onBook, onOrder }) {
  return (
    <header className="max-w-6xl mx-auto px-6 py-16 text-center space-y-6">
      <h1 className="text-5xl md:text-6xl font-semibold tracking-tight leading-tight">
        Discover. Dine. Deliver.
      </h1>
      <p className="text-lg text-black/70 max-w-2xl mx-auto">
        Explore the best restaurants near you in a clean black & white theme.
      </p>
      <div className="flex justify-center gap-3 mt-6">
        <button
          onClick={onBook}
          className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-black/90 active:translate-y-px transition"
        >
          Book a Table
        </button>
        <button
          onClick={onOrder}
          className="px-6 py-3 border border-black/20 rounded-lg hover:bg-black/5 transition"
        >
          Order Food
        </button>
      </div>
    </header>
  );
}
