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
    <div>
      <h1 className="text-center text-zinc-800 md:text-4xl font-light md:mt-10 md:mb-10 text-2xl mt-3.5 mb-3.5">
        Our Latest Collection
      </h1>

      <div className="w-full md:h-[85vh] h-[24vh] relative flex items-center justify-center bg-center brightness-75 overflow-hidden">
        {shopNowImage && (
          <Image
            src={shopNowImage}
            alt="Latest Collection Background"
            fill
            priority
            className=" object-center object-cover w-full h-full  z-0"
          />
        )}

        <Link
          href="/shop"
          prefetch
          className="relative z-20 flex items-center gap-2 justify-center h-fit py-2 cursor-pointer text-center text-white md:px-4 px-2 border-2 border-white rounded-md text-sm md:text-2xl"
        >
          <ShoppingBag size={25} className="md:text-2xl" /> Shop Now
        </Link>
      </div>
    </div>
  );
};

export default LatestCollection;
