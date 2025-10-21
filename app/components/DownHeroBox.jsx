"use client";
import React from "react";

const DownHeroBox = ({ imageUrl, title }) => {
  return (
    <div className="w-[210px] h-[210px] md:w-[460px] md:h-[460px] relative overflow-hidden ">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 brightness-62"
        loading="lazy"
      />
      <div className="absolute bottom-0 w-full font-light lg:font-medium  text-white text-center text-sm md:text-lg pb-3 px-2 truncate">
        {title}
      </div>
    </div>
  );
};

export default DownHeroBox;
