"use client";

import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const LatestCollection = () => {
  const [shopNowImage, setShopNowImage] = useState(null);

  useEffect(() => {
    const fetchShopNowImage = async () => {
      try {
        const res = await fetch("/api/shop-now/upload");
        const data = await res.json();
        setShopNowImage(data.imageUrl || null);
      } catch (err) {
        console.error("Failed to fetch shop now image:", err);
      }
    };

    fetchShopNowImage();
  }, []);

  return (
    <div className="w-full">
      <div className="relative w-full md:h-[90vh] h-[35vh] flex items-center justify-center overflow-hidden group">
        {/* Background Image with Overlay */}
        {shopNowImage && (
          <>
            <Image
              src={shopNowImage}
              alt="Latest Collection Background"
              fill
              priority
              className="object-center object-cover w-full h-full z-0 group-hover:scale-105 transition-transform duration-700"
            />
            {/* Overlay gradient - does not affect button */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40 z-10"></div>
          </>
        )}

        {/* Shop Now Button - Separate from overlay */}
        <div className="relative z-20 flex items-center justify-center">
          <Link
            href="/shop"
            prefetch
            className="group/btn relative flex items-center gap-2 md:gap-3 justify-center 
               px-6 py-3 md:px-12 md:py-6 
               text-white font-light tracking-wider text-base md:text-3xl 
               border-2 border-white rounded-sm 
               hover:bg-gray-100 hover:text-black hover:border-gray-100 
               transition-all duration-500 overflow-hidden shadow-lg hover:shadow-2xl"
          >
            <ShoppingBag
              size={20} // smaller icon by default
              className="md:w-8 md:h-8 group-hover/btn:scale-110 transition-transform duration-300"
            />
            <span className="font-light tracking-widest text-sm md:text-3xl">
              SHOP NOW
            </span>

            {/* Animated underline on hover */}
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gray-900 to-transparent scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-500"></div>
          </Link>
        </div>

        {/* Decorative corner accents */}
        <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-white/20 z-15 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-white/20 z-15 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
    </div>
  );
};

export default LatestCollection;
