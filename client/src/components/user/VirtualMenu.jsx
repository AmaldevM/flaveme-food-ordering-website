import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FoodModelViewer } from '../ui/FoodModelViewer';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const foodDetails = {
  burger: {
    title: 'Ultimate Double Beef Burger',
    description: 'Double grilled flame-seared Angus beef patty, cheddar cheese, fresh ruffled lettuce, and our secret burger sauce layered between buttery toasted sesame buns.',
    prepTime: '12 Mins',
    calories: '650 Kcal',
    price: '$12.99',
    rating: '★ 4.9'
  },
  pizza: {
    title: 'Classic Pepperoni Pizza',
    description: 'Crispy stone-baked crust topped with rich tomato marinara sauce, generous layers of premium Mozzarella cheese, seasoned beef pepperoni, and fresh basil leaves.',
    prepTime: '18 Mins',
    calories: '980 Kcal',
    price: '$15.99',
    rating: '★ 4.8'
  },
  donut: {
    title: 'Strawberry Frosting Donut',
    description: 'Fluffy golden-fried donut base coated with sweet glazed strawberry frosting and decorated with a rainbow sprinkle mix. Perfect morning or afternoon treat.',
    prepTime: '5 Mins',
    calories: '320 Kcal',
    price: '$3.49',
    rating: '★ 4.7'
  },
  drink: {
    title: 'Sparkling Orange Citrus Fizz',
    description: 'Tangy fresh-pressed orange juice blend mixed with carbonated club soda, served over solid crystal ice cubes and garnished with a clean paper straw.',
    prepTime: '3 Mins',
    calories: '110 Kcal',
    price: '$4.99',
    rating: '★ 4.9'
  }
};

export const VirtualMenu = () => {
  const [activeTab, setActiveTab] = useState('burger');

  return (
    <section className="py-16 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-xl overflow-hidden max-w-screen-xl mx-auto my-10">
      <div className="px-6 lg:px-12">
        {/* Title / Heading */}
        <div className="text-center space-y-4 mb-12">
          <p className="text-sm font-bold text-amber-400 uppercase tracking-widest">Futuristic Experience</p>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-montserrat leading-tight">
            Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Virtual 3D Menu</span>
          </h2>
          <p className="text-gray-300 max-w-xl mx-auto text-base sm:text-lg">
            Interact directly with our dishes! Rotate, spin, and zoom into our handcrafted food items to inspect the ingredients.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex justify-center space-x-3 mb-10 overflow-x-auto pb-2">
          {Object.keys(foodDetails).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-6 py-3 rounded-full text-sm sm:text-base font-bold transition-all duration-300 capitalize flex-shrink-0 ${
                activeTab === tab 
                  ? 'text-white bg-gradient-to-r from-amber-500 to-orange-600 shadow-md shadow-orange-500/20' 
                  : 'text-gray-400 bg-white/5 hover:bg-white/10 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 3D Viewer & Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Details Column */}
          <div className="order-2 lg:order-1 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <span className="bg-amber-500/20 text-amber-400 text-xs px-3 py-1.5 rounded-full font-extrabold tracking-wide">
                    {foodDetails[activeTab].rating}
                  </span>
                  <span className="text-gray-300 text-sm font-semibold">
                    Fast Prep
                  </span>
                </div>

                <h3 className="text-3xl font-extrabold text-white font-montserrat">
                  {foodDetails[activeTab].title}
                </h3>
                
                <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                  {foodDetails[activeTab].description}
                </p>

                {/* Details Table */}
                <div className="grid grid-cols-3 gap-4 border-y border-white/10 py-5">
                  <div>
                    <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">Calories</p>
                    <p className="text-white text-base sm:text-lg font-bold">{foodDetails[activeTab].calories}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">Prep Time</p>
                    <p className="text-white text-base sm:text-lg font-bold">{foodDetails[activeTab].prepTime}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">Avg Price</p>
                    <p className="text-amber-400 text-base sm:text-lg font-extrabold">{foodDetails[activeTab].price}</p>
                  </div>
                </div>

                {/* Call To Action */}
                <div className="pt-4">
                  <Link to="/rest" className="inline-block">
                    <button className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold px-6 py-3.5 rounded-full shadow-lg shadow-orange-500/35 active:scale-[0.98] transition-all">
                      Find Restaurants
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 3D Visualizer Column */}
          <div className="order-1 lg:order-2 bg-gradient-to-br from-white/5 to-white/0 rounded-3xl p-6 border border-white/5 relative min-h-[380px] flex items-center justify-center shadow-inner">
            {/* Absolute positioning of instructions badge */}
            <div className="absolute top-4 right-4 bg-black/40 text-white/70 text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-md border border-white/5 pointer-events-none select-none">
              Drag to Rotate
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
              >
                <FoodModelViewer type={activeTab} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
