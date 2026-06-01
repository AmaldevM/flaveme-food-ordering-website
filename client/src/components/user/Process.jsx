import React from "react";
import logo from "../../assets/AI images/12.png";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import one from "../../assets/AI images/process/1.png";

export const Process = () => {
  return (
    <div className="my-14 mx-auto max-w-screen-lg">
      <section
        className="bg-cover bg-center bg-no-repeat body-font rounded-3xl shadow-2xl border border-white/10 overflow-hidden"
        style={{ backgroundImage: `url(${one})` }}
      >
        <div className="bg-black/45 backdrop-blur-sm w-full h-full py-12 px-6 sm:px-10 flex flex-col md:flex-row items-center gap-10">
          {/* Left Image Section */}
          <div className="md:w-1/2 w-full flex justify-center relative transition-transform duration-300 hover:scale-[1.03]">
            <img
              src={logo}
              alt="A Very Simple Process to Order"
              className="w-full max-w-xs sm:max-w-sm md:max-w-md rounded-2xl object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
            />
          </div>

          {/* Right Text Section */}
          <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-white font-montserrat">
              A Very Simple Process <br />
              To Make Order Your <span className="text-amber-400">Favourite Foods</span>
            </h2>
            <p className="leading-relaxed text-gray-200 text-base md:text-lg">
              Follow these simple steps to enjoy your meal quickly and hassle-free, delivered straight to your door.
            </p>

            {/* Steps */}
            <div className="flex flex-col space-y-3 w-full max-w-md">
              {[
                "Set your location first",
                "Choose the food you want to order",
                "Confirm your order with payment method",
                "Within 30 minutes, you will get your food",
              ].map((step, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 bg-white/10 hover:bg-white/20 p-3.5 rounded-xl border border-white/5 shadow-md duration-200 ease-in-out hover:scale-[1.02] cursor-default"
                >
                  <div className="bg-amber-500 text-white rounded-full p-1.5 flex items-center justify-center shadow-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4.5 12.75 6 6 9-13.5"
                      />
                    </svg>
                  </div>
                  <p className="text-white text-sm sm:text-base font-semibold">
                    {step}
                  </p>
                </div>
              ))}
            </div>

            {/* Button */}
            <div className="mt-4">
              <Link to="/signup">
                <button className="relative group p-3.5 px-8 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full text-base sm:text-lg font-bold shadow-lg shadow-orange-500/35 hover:shadow-orange-500/50 duration-200 ease-in-out hover:scale-[1.05] active:scale-[0.98] transition-all">
                  <span className="inline-block group-hover:opacity-0 transition-all duration-300">
                    Order Food Now
                  </span>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="mr-2">Get Started</span>
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
