"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import CustomDropdown from "../components/CustomDropdown";

const ShopClient = ({ products }) => {
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [sortOption, setSortOption] = useState("name-asc");

  const sortProducts = () => {
    try {
      switch (sortOption) {
        case "name-asc":
          return [...products].sort((a, b) => a.title.localeCompare(b.title));
        case "name-desc":
          return [...products].sort((a, b) => b.title.localeCompare(a.title));
        case "price-asc":
          return [...products].sort(
            (a, b) => parseFloat(a.price) - parseFloat(b.price)
          );
        case "price-desc":
          return [...products].sort(
            (a, b) => parseFloat(b.price) - parseFloat(a.price)
          );
        case "date-asc":
          return [...products].sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
        case "date-desc":
          return [...products].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
        default:
          return [...products];
      }
    } catch (error) {
      console.error("Sorting error:", error);
      return [...products];
    }
  };

  const sortedProducts = sortProducts();

  return (
    <div className="min-h-screen px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 pt-12 sm:w-[90%] md:w-[95%] lg:w-[80%] xl:w-[80%] mx-auto">
      <div className="mb-7 text-center">
        <h1 className="text-4xl md:text-5xl font-light mb-4 text-neutral-900">
          Perfume Collection
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our premium selection of perfumes. Crafted for elegance and
          lasting fragrance.
        </p>
      </div>

      <div className="mb-8 text-center flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 sm:space-x-4 px-2">
        <div className="flex items-center">
          <p className="mr-2 text-zinc-800">Sort by:</p>
          <CustomDropdown
            options={[
              { label: "Name (A-Z)", value: "name-asc" },
              { label: "Name (Z-A)", value: "name-desc" },
              { label: "Price (Low to High)", value: "price-asc" },
              { label: "Price (High to Low)", value: "price-desc" },
              { label: "Date (Old to New)", value: "date-asc" },
              { label: "Date (New to Old)", value: "date-desc" },
            ]}
            selectedOption={sortOption}
            onSelect={setSortOption}
          />
        </div>
        <p className="text-gray-600">{`${sortedProducts.length} products`}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-15">
        {sortedProducts.map((product, index) => (
          <Link key={product._id} href={`/shop/${product._id}`}>
            <div
              className="group relative rounded-xs overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer h-full flex flex-col"
              onMouseEnter={() => setHoveredProduct(index)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Images */}
              <div className="relative w-full aspect-square overflow-hidden">
                <Image
                  src={product.frontImg}
                  alt={product.title}
                  fill
                  className="object-cover transition-all duration-700"
                  style={{ opacity: hoveredProduct === index ? 0 : 1 }}
                />
                <Image
                  src={product.backImg}
                  alt={`${product.title} back`}
                  fill
                  className="object-cover transition-all duration-700"
                  style={{ opacity: hoveredProduct === index ? 1 : 0 }}
                />

                {/* Sold Out Badge */}
                {product.quantity === "0" && (
                  <p className="absolute bottom-2 bg-gray-800 left-2 text-white px-2 py-1 rounded-2xl text-sm font-light">
                    Sold Out
                  </p>
                )}
              </div>

              {/* Info */}
              <div className="p-4 flex-grow flex flex-col">
                <h2 className="text-sm md:text-base font-bold mb-1 text-gray-800 line-clamp-2">
                  {product.title}
                </h2>
                <p className="text-gray-600 text-sm mb-1">{product.ml} ml</p>
                <div className="mt-auto flex justify-between items-center">
                  <p className="text-sm md:text-base font-semibold text-gray-700">
                    {product.price} DT
                  </p>
                  <ShoppingCart size={16} className="text-gray-600" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ShopClient;
