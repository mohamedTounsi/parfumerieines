"use client";

import {
  Images,
  PillBottle,
  Shirt,
  Store,
  Menu,
  X,
  ListOrdered,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const Leftsidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:h-screen lg:w-[350px] h-fit w-full bg-neutral-900 z-100 sticky top-0 ">
      <div className="flex flex-col items-center justify-center py-4">
        <Link href="/">
          <Image
            src="/bnblogo.png"
            alt=""
            width={125}
            height={125}
            className="filter invert brightness-200"
          />
        </Link>

        {/* Hamburger Icon */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-white absolute top-4 right-4 z-20"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Navigation Items */}
        <ul
          className={`text-white flex flex-col gap-6 pb-5 transition-all duration-300 ease-in-out ${
            isOpen ? "block" : "hidden"
          } lg:flex`}
        >
          <Link href="/dashbord/heroImage" onClick={() => setIsOpen(false)}>
            <li className="flex flex-col lg:flex-row items-center gap-2 hover:bg-white hover:text-black transition-all duration-300 ease-in-out px-2 py-2 rounded-md">
              <Images /> Hero Image
            </li>
          </Link>
          <Link href="/dashbord/shopNowImage" onClick={() => setIsOpen(false)}>
            <li className="flex flex-col lg:flex-row items-center gap-2 hover:bg-white hover:text-black transition-all duration-300 ease-in-out px-2 py-2 rounded-md">
              <Store /> Shop Now Image
            </li>
          </Link>
          <Link
            href="/dashbord/recentCapsuleImages"
            onClick={() => setIsOpen(false)}
          >
            <li className="flex flex-col lg:flex-row items-center gap-2 hover:bg-white hover:text-black transition-all duration-300 ease-in-out px-2 py-2 rounded-md">
              <PillBottle /> RECENT-capsule images
            </li>
          </Link>
          <Link href="/dashbord/products" onClick={() => setIsOpen(false)}>
            <li className="flex flex-col lg:flex-row items-center gap-2 hover:bg-white hover:text-black transition-all duration-300 ease-in-out px-2 py-2 rounded-md">
              <Shirt /> Products
            </li>
          </Link>
          <Link href="/dashbord/orders" onClick={() => setIsOpen(false)}>
            <li className="flex flex-col lg:flex-row items-center gap-2 hover:bg-white hover:text-black transition-all duration-300 ease-in-out px-2 py-2 rounded-md">
              <ListOrdered /> orders
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default Leftsidebar;
