"use client";
import React, { useState, useEffect } from "react";
import { ChevronRight, Sparkles } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 20;
    const y = (clientY / window.innerHeight - 0.5) * 20;
    setMousePosition({ x, y });
  };

  return (
    <div
      className="relative w-full h-fit pb-15  overflow-hidden bg-gradient-to-br from-white via-gray-200 to-pink-200/60"
      onMouseMove={handleMouseMove}
    >
      {/* Main hero content */}
      <div className="relative z-10 w-full h-fit pt-10 md:pt-32 flex flex-col  md:flex-row items-center pb-0 md:pb-20">
        <div className="max-w-7xl mx-auto w-full px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 tracking-tight leading-tight">
                Ines
                <span className="block text-gray-800 mt-2">Parfumerie</span>
              </h1>
              <div className="flex gap-4 pt-4">
                <div className="w-20 h-0.5 bg-gray-900"></div>
              </div>
            </div>

            <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed max-w-md">
              Discover exquisite scents that transcend time. Where luxury meets
              artistry, and every spray is a moment of pure elegance.
            </p>

            {/* Feature highlights */}
            <div className="flex gap-8 py-6 border-t border-zinc-700 border-b">
              <div className="space-y-1">
                <p className="text-xs text-gray-700 tracking-widest font-medium">
                  CRAFTSMANSHIP
                </p>
                <p className="text-gray-900 font-light text-sm">
                  Natural Extracts
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-700 tracking-widest font-medium">
                  SUSTAINABILITY
                </p>
                <p className="text-gray-900 font-light text-sm">Eco-Luxury</p>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button className="group cursor-pointer relative px-8 py-3 bg-zinc-700 text-white tracking-widest text-sm font-medium overflow-hidden transition-all duration-300 flex items-center justify-center gap-2 hover:bg-transparent hover:border hover:text-zinc-800 hover:border-zinc-800 ">
                <span
                  onClick={() => router.push("/shop")}
                  className="relative z-10"
                >
                  EXPLORE NOW
                </span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
              </button>
              <button
                onClick={() => router.push("/shop")}
                className="px-8 py-3 border cursor-pointer border-gray-900 text-gray-900 tracking-widest text-sm font-medium hover:bg-zinc-800 hover:text-white transition-all duration-300"
              >
                SHOP COLLECTION
              </button>
            </div>
          </div>

          {/* Right content - Enhanced perfume image */}
          <div className="hidden lg:flex justify-center items-center relative h-full">
            <div
              className="relative w-full h-full flex items-center justify-center"
              style={{
                transform: `perspective(1200px) rotateX(${
                  mousePosition.y * 0.2
                }deg) rotateY(${mousePosition.x * 0.2}deg)`,
              }}
            >
              {/* Enhanced image container */}
              <div className="relative z-10 md:w-120 md:h-120 rounded-lg flex items-center justify-center bg-white/40 backdrop-blur-sm border border-gray-200/60 shadow-sm">
                <div className="relative md:w-100 md:h-100 ">
                  <Image
                    src="/ineshero1.png"
                    alt="Luxury Perfume - Ines Parfumerie"
                    fill
                    className="object-contain drop-shadow-lg rounded-lg"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>

              {/* Subtle floating elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gray-200/30 rounded-full"></div>
              <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-gray-300/20 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
