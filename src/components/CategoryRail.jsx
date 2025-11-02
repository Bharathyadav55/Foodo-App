import React from "react";

export default function CategoryRail({
  categories = [],
  selected = null,
  onCategoryClick = () => {},
  railRef,
  scrollRail = () => {},
}) {
  const safeCategories = Array.isArray(categories) ? categories : [];
  return (
    <section className="space-y-6 mb-10">
      <h2 className="text-2xl font-semibold">Inspiration for Your First Order</h2>
      <div className="relative">
        <div
          ref={railRef}
          className="flex gap-8 overflow-x-auto py-3 scroll-smooth scrollbar-hide"
        >
          {safeCategories.map((name) => (
            <button
              key={name}
              onClick={() => onCategoryClick(name)}
              className={`w-40 shrink-0 text-center transition-transform hover:scale-105 ${
                selected === name ? "opacity-100 font-bold" : "opacity-70 font-medium"
              }`}
            >
              <div className="h-36 w-36 mx-auto rounded-full bg-gradient-to-br from-black/5 to-black/15 border shadow-sm" />
              <p className="mt-3 text-lg">{name}</p>
            </button>
          ))}
        </div>
        <button
          onClick={() => scrollRail(-1)}
          className="hidden md:flex items-center justify-center absolute left-0 top-12 -translate-y-12 h-10 w-10 bg-white rounded-full shadow-md hover:shadow-lg"
        >
          ‹
        </button>
        <button
          onClick={() => scrollRail(1)}
          className="hidden md:flex items-center justify-center absolute right-0 top-12 -translate-y-12 h-10 w-10 bg-white rounded-full shadow-md hover:shadow-lg"
        >
          ›
        </button>
      </div>
    </section>
  );
}
