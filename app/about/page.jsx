import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const AboutPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      <Header />
      <main className="flex-grow">
        {/* First Section: About + Image */}
        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16 max-w-6xl mx-auto">
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-4xl font-light text-gray-900">
                  The Art of Scent
                </h2>
                <div className="w-16 h-0.5 bg-pink-200/60"></div>
              </div>
              <p className="text-lg leading-relaxed text-gray-600">
                Welcome to{" "}
                <span className="font-semibold text-gray-900">
                  Parfumerie Ines
                </span>
                , where fragrance becomes an unforgettable experience. Founded
                with a passion for olfactory artistry, we curate exclusive
                scents that tell stories and evoke emotions. Each perfume in our
                collection is a masterpiece, carefully crafted to transport you
                to moments of pure elegance and sophistication.
              </p>
              <p className="text-lg leading-relaxed text-gray-600">
                Our philosophy is rooted in the belief that a signature scent is
                more than just a fragrance—it's a personal statement, a memory
                capsule, and an intimate expression of one's identity. We blend
                traditional craftsmanship with innovative techniques to create
                scents that are both timeless and contemporary.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-pink-100/40 to-gray-100/40 rounded-2xl transform rotate-3"></div>
                <img
                  src="/logoines2.png"
                  alt="Ines Parfumerie Founder"
                  className="relative rounded-2xl shadow-lg w-full max-w-md h-[500px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
