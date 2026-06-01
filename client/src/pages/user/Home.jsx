import React, { useState } from "react";
import logo from "../../assets/hero/5.png";
import { HowDoesitWork } from "@/components/user/HowDoesitWork";
import { Process } from "@/components/user/Process";
import { Whychooseus } from "@/components/user/Whychooseus";
import { RestaurantPage } from "./RestaurantPage";
import { VirtualMenu } from "@/components/user/VirtualMenu";
import Stats from "../../components/ui/Stats";
import review from "../../assets/icons/review.png";
import food from "../../assets/icons/food2.png";
import rest from "../../assets/icons/rest 2.png";

export const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearch = (event) => {
    event.preventDefault();
    console.log("Search Query:", searchQuery);
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <main className="home py-10 sm:py-16 md:py-20 lg:py-12 custom-rounded min-h-screen flex items-center">
        <div className="px-6 mx-auto max-w-screen-xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-12 lg:gap-x-12 items-center">
            {/* Text Section */}
            <div className="text-center lg:text-left space-y-8">
              <h1 className="text-4xl leading-tight font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl font-montserrat">
                Fastest Online{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                  Food Delivery
                </span>{" "}
                Service.
              </h1>
              <p className="text-lg text-gray-200 font-medium max-w-xl mx-auto lg:mx-0">
                Order from your favorite restaurants and get hot, delicious food delivered to your doorstep in minutes.
              </p>
              
              {/* Search Form */}
              <form className="mt-8 max-w-lg mx-auto lg:mx-0" onSubmit={handleSearch}>
                <div className="relative flex flex-col sm:flex-row items-center p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl gap-3 sm:gap-0 shadow-lg focus-within:border-amber-400 transition-all duration-300">
                  <input
                    type="text"
                    placeholder="Search food or partner restaurants..."
                    className="w-full px-4 py-3.5 text-white bg-transparent border-none outline-none placeholder-gray-300 font-semibold text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 text-base font-bold rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg active:scale-[0.97] transition-all duration-200"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
                <Stats img={review} value="4.8/5" label="Customer Reviews" />
                <Stats img={food} value="10K+" label="Delicious Foods Served" />
                <Stats img={rest} value="500+" label="Partner Restaurants" />
              </div>
            </div>

            {/* Image Section */}
            <div className="flex justify-center relative">
              {/* Decorative background glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 bg-amber-500/20 rounded-full blur-3xl -z-10"></div>
              <img
                className="object-contain max-h-[450px] sm:max-h-[550px] drop-shadow-[0_15px_30px_rgba(0,0,0,0.3)] transition-transform duration-500 hover:rotate-2 hover:scale-[1.02]"
                alt="Flave Me Delivery"
                src={logo}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Main Core sections */}
      <div className="px-6 mx-auto max-w-screen-xl space-y-20">
        {/* Restaurants listing */}
        <section id="restaurants">
          <RestaurantPage />
        </section>

        {/* How Does It Work */}
        <section id="how-it-works">
          <HowDoesitWork />
        </section>

        {/* Simple Process */}
        <section id="process">
          <Process />
        </section>

        {/* Virtual 3D Menu */}
        <section id="virtual-menu">
          <VirtualMenu />
        </section>

        {/* Why Choose Us & Testimonials */}
        <section id="why-us">
          <Whychooseus />
        </section>
      </div>
    </div>
  );
};
