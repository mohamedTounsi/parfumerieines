"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import DownHeroBox from "./DownHeroBox";

const DownHero = () => {
  const [mediaData, setMediaData] = useState([]);

  // Fetch capsule data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/recent-capsule/upload");
        const data = await response.json();

        if (data.error) {
          console.error("Error fetching data:", data.error);
          return;
        }

        setMediaData(data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []); // Empty dependency array to only run on mount

  return (
    <div className="w-full flex flex-col items-center justify-center overflow-hidden mb-12">
      <h1 className="mt-7 text-2xl text-zinc-800 font-light">-RECENT-</h1>
      <h1 className="text-4xl text-zinc-800 font-light flex items-center gap-2">
        <div className="relative w-[60px] h-[60px] md:w-[100px] md:h-[100px]">
          <Image
            src="/bnblogo.png"
            alt="logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        Capsules
      </h1>
      <div className="relative w-full overflow-hidden px-4 sm:px-6">
        <Marquee speed={70} gradient={false} className="py-4">
          {mediaData.length > 0 ? (
            mediaData.map((item, index) => (
              <div
                key={index}
                className="px-4 flex items-center justify-center"
              >
                <DownHeroBox {...item} />
              </div>
            ))
          ) : (
            <p>Loading...</p> // Display loading text if data is still being fetched
          )}
        </Marquee>
      </div>
    </div>
  );
};

export default DownHero;
