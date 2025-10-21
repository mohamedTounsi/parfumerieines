import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const page = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        {/* First Section: About + Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12 max-w-6xl mx-auto">
          <div>
            <h2 className="text-4xl font-bold mb-6 text-center md:text-left">
              About Me
            </h2>
            <p className="text-lg leading-relaxed text-gray-600">
              Hi! I'm{" "}
              <span className="font-semibold text-black">[Your Name]</span>, a
              passionate developer who loves building modern and engaging web
              applications. I specialize in front-end development using the
              latest tools and frameworks. When I'm not coding, I enjoy{" "}
              <span className="italic">[Your Hobbies/Interests]</span> and
              exploring new technologies.
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src="/midos.jpg"
              alt="Your Name"
              className="rounded-2xl shadow-xl w-full max-w-sm h-[450px] object-cover"
            />
          </div>
        </div>

        {/* Second Section: Logo + Paragraph */}
        <div className="mt-20 text-center">
          <img
            src="/bnblogo.png"
            alt="Logo"
            className="mx-auto mb-6 w-28 h-28 object-contain"
          />
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            I'm constantly working on new ideas and love collaborating with
            others to bring creative visions to life. Take a look at my latest
            projects or reach out — I’m always open to exciting opportunities!
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default page;
