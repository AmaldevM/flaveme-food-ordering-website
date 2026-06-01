import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, Sparkles, ShoppingCart, HelpCircle as Dice, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

// Categories on the wheel
const wheelCategories = [
  { name: "Burgers", color: "#f59e0b", icon: "🍔" },
  { name: "Pizzas", color: "#ef4444", icon: "🍕" },
  { name: "Donuts", color: "#ec4899", icon: "🍩" },
  { name: "Drinks", color: "#3b82f6", icon: "🥤" },
  { name: "Desserts", color: "#a78bfa", icon: "🍰" }
];

export const CravingRoulette = ({ menuItems, onAddToCartDirectly, onItemClick }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [recommendedItem, setRecommendedItem] = useState(null);

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSelectedCategory(null);
    setRecommendedItem(null);

    // Generate random spins (minimum 5 full spins + random offset)
    const extraSpins = 5 + Math.floor(Math.random() * 5);
    const randomIndex = Math.floor(Math.random() * wheelCategories.length);
    const segmentAngle = 360 / wheelCategories.length;
    
    // Calculate new target rotation (aligned to point at the top indicator)
    // Indicator is at 0 degrees. Each segment is segmentAngle wide.
    // To align segment target to top, offset is: 360 - (randomIndex * segmentAngle) - (segmentAngle / 2)
    const targetAngle = 360 * extraSpins + (360 - (randomIndex * segmentAngle) - (segmentAngle / 2));
    
    setRotation(targetAngle);

    setTimeout(() => {
      setIsSpinning(false);
      const landedCategory = wheelCategories[randomIndex];
      setSelectedCategory(landedCategory);

      // Find items in this category from DB / dummy list
      const matchingItems = menuItems.filter(
        (item) => item.category?.toLowerCase() === landedCategory.name.toLowerCase()
      );

      if (matchingItems.length > 0) {
        const randomProduct = matchingItems[Math.floor(Math.random() * matchingItems.length)];
        setRecommendedItem(randomProduct);
        toast.success(`Craving Roulette recommended: ${randomProduct.name}!`, { icon: "🎰" });
      } else {
        toast.error(`No items found under ${landedCategory.name} currently.`);
      }
    }, 4000); // Animation duration
  };

  return (
    <section className="py-16 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-xl overflow-hidden max-w-screen-xl mx-auto my-10 relative">
      {/* Decorative glows */}
      <div className="absolute top-[-20%] right-[-10%] w-60 h-60 bg-purple-600/10 rounded-full blur-[80px]"></div>
      <div className="absolute bottom-[-10%] left-[-15%] w-60 h-60 bg-amber-500/10 rounded-full blur-[80px]"></div>

      <div className="px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left column: Spinner wheel graphic */}
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative w-80 h-80 sm:w-[380px] sm:h-[380px] flex items-center justify-center">
            
            {/* Top Indicator arrow */}
            <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-red-500 z-20 filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]"></div>

            {/* Glowing outer bezel */}
            <div className="absolute inset-0 rounded-full border-8 border-gray-800 dark:border-gray-950 shadow-2xl bg-slate-900/50 backdrop-blur-xl"></div>
            
            {/* Spinner Wheel Board */}
            <motion.div
              animate={{ rotate: rotation }}
              transition={isSpinning ? { duration: 4, ease: "circOut" } : { duration: 0 }}
              className="w-full h-full rounded-full overflow-hidden relative border-4 border-amber-500/20"
              style={{ transformOrigin: "center" }}
            >
              {/* Generate slices */}
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {wheelCategories.map((cat, idx) => {
                  const angle = 360 / wheelCategories.length;
                  const startAngle = idx * angle;
                  
                  // Convert angles to polar coordinates for SVG slices
                  const rad1 = ((startAngle - 90) * Math.PI) / 180;
                  const rad2 = (((startAngle + angle) - 90) * Math.PI) / 180;
                  
                  const x1 = 50 + 50 * Math.cos(rad1);
                  const y1 = 50 + 50 * Math.sin(rad1);
                  const x2 = 50 + 50 * Math.cos(rad2);
                  const y2 = 50 + 50 * Math.sin(rad2);
                  
                  return (
                    <path
                      key={idx}
                      d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                      fill={cat.color}
                      opacity={0.8}
                      stroke="#1e293b"
                      strokeWidth="0.8"
                    />
                  );
                })}
              </svg>

              {/* Icons overlays placed absolutely on slices */}
              {wheelCategories.map((cat, idx) => {
                const angle = 360 / wheelCategories.length;
                const midAngle = idx * angle + angle / 2 - 90;
                const rad = (midAngle * Math.PI) / 180;
                
                // Position offset from center
                const x = 50 + 30 * Math.cos(rad);
                const y = 50 + 30 * Math.sin(rad);

                return (
                  <div
                    key={idx}
                    className="absolute w-8 h-8 flex items-center justify-center text-xl font-bold text-white filter drop-shadow-md select-none pointer-events-none"
                    style={{
                      left: `calc(${x}% - 1rem)`,
                      top: `calc(${y}% - 1rem)`,
                      transform: `rotate(${midAngle + 90}deg)`
                    }}
                  >
                    {cat.icon}
                  </div>
                );
              })}
            </motion.div>

            {/* Central Spin Button */}
            <button
              onClick={handleSpin}
              disabled={isSpinning}
              className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 border-4 border-gray-800 dark:border-gray-950 text-white font-extrabold text-sm sm:text-base shadow-xl active:scale-95 disabled:opacity-85 disabled:pointer-events-none cursor-pointer flex flex-col items-center justify-center transition-all z-10"
            >
              {isSpinning ? (
                <span className="animate-spin text-lg">⏳</span>
              ) : (
                <>
                  <Dice className="w-5 h-5 mb-0.5 animate-bounce" />
                  <span>SPIN</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right column: Explanation & Recommended item card */}
        <div className="space-y-6 flex flex-col justify-center text-center lg:text-left">
          <div className="space-y-3">
            <p className="text-sm font-extrabold text-amber-500 uppercase tracking-widest flex items-center gap-1.5 justify-center lg:justify-start">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              Decision Helper
            </p>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-montserrat leading-tight">
              Can't Decide? Try <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                Craving Roulette!
              </span>
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-lg mx-auto lg:mx-0">
              Spin the interactive category board! We will select a dish matching your spin and help satisfy your cravings instantly.
            </p>
          </div>

          <div className="min-h-[190px] flex items-center justify-center lg:justify-start">
            <AnimatePresence mode="wait">
              {isSpinning && (
                <motion.div
                  key="spinning-loader"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-panel p-6 rounded-2xl w-full max-w-sm flex flex-col items-center justify-center text-center space-y-3"
                >
                  <span className="loading loading-spinner text-amber-500 loading-lg"></span>
                  <p className="text-gray-300 font-bold text-sm">Selecting your flavor match...</p>
                </motion.div>
              )}

              {!isSpinning && recommendedItem && (
                <motion.div
                  key="recommendation-card"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  onClick={() => onItemClick(recommendedItem)}
                  className="glass-panel p-5 rounded-2xl w-full max-w-sm flex items-center gap-4 border border-amber-500/20 shadow-lg cursor-pointer hover:border-amber-500/40 transition-all group"
                >
                  <img
                    src={recommendedItem.image}
                    alt={recommendedItem.name}
                    className="w-20 h-20 object-cover rounded-xl shrink-0 border border-white/5"
                  />
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="bg-amber-500/10 text-amber-400 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        {selectedCategory?.name}
                      </span>
                      <span className="text-amber-500 text-xs font-bold">★ {recommendedItem.rating || "4.8"}</span>
                    </div>
                    
                    <h4 className="text-white font-bold text-base leading-tight truncate group-hover:text-amber-400 transition-colors font-montserrat">
                      {recommendedItem.name}
                    </h4>
                    
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-white font-extrabold text-lg">₹{recommendedItem.price}</span>
                      <button
                        onClick={(e) => onAddToCartDirectly(e, recommendedItem)}
                        className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-lg text-xs shadow-md transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        Add
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {!isSpinning && !recommendedItem && (
                <motion.div
                  key="empty-recommendation"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-panel p-6 rounded-2xl w-full max-w-sm text-center flex flex-col items-center justify-center border border-white/5 space-y-2.5 py-8"
                >
                  <Dice className="w-8 h-8 text-gray-500 animate-bounce" />
                  <p className="text-gray-400 text-sm font-semibold">Click SPIN above to decide your meal!</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
