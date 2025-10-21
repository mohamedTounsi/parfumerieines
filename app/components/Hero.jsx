"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  const [heroImage, setHeroImage] = useState(null);

  useEffect(() => {
    // Fetch the current hero image from the backend
    const fetchHeroImage = async () => {
      try {
        const res = await fetch("/api/hero/upload"); // Make sure this route fetches the image URL
        const data = await res.json();
        if (data?.imageUrl) {
          setHeroImage(data.imageUrl);
        } else {
          setHeroImage("/hero1.png"); // Fallback image in case no image is set
        }
      } catch (err) {
        console.error("Failed to fetch hero image:", err);
        setHeroImage("/hero1.png"); // Fallback image in case of error
      }
    };

    fetchHeroImage();
  }, []);

  return (
    <div className="relative lg:h-[60vh] h-[21vh] md:h-[45vh] xl:h-[93vh] w-full overflow-hidden">
      {/* Background Image */}
      <Image
        src={heroImage || "/hero1.png"} // Use the fetched image or fallback to default
        alt="Hero background"
        fill
        priority
        className="object-cover z-0"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Text Content with animation */}
      <div className="relative z-20 flex items-center justify-center h-full text-center text-white px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <Image
            src="/bnblogo.png"
            alt="Main logo"
            width={230}
            height={230}
            className="filter invert brightness-200 md:w-[500px] md:h-[500px]"
            priority
          />
        </motion.div>
      </div>
    </div>
  );
}
