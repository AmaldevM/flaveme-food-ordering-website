import React, { useState, useEffect } from "react";
import { Sparkles, ShoppingBag, ArrowRight, ChefHat } from "lucide-react";
import { axiosInstance } from "../../config/axiosInstance";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function AIRecommendations() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecommendations = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/user/recommendations");
      setItems(response.data || []);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async (menuItem) => {
    try {
      const response = await axiosInstance({
        method: "POST",
        url: "/cart/addCart",
        data: {
          items: [
            {
              menuItem: menuItem,
              quantity: 1,
            },
          ],
        },
      });
      toast.success(response.data?.message || "Item added to cart!");
    } catch (error) {
      const errMsg = error.response?.data?.message || "Please log in to add items to cart.";
      toast.error(errMsg);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  if (isLoading) {
    return (
      <div className="py-12 container mx-auto px-6">
        <div className="h-4 bg-gray-200/50 dark:bg-gray-800/50 rounded-full w-48 mb-6 animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="h-80 bg-white/40 dark:bg-gray-900/40 border border-gray-100/50 dark:border-gray-800/50 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return null; // Don't render anything if no menu items are available
  }

  return (
    <section className="py-12 relative w-full overflow-hidden font-montserrat">
      <div className="container mx-auto px-6">
        {/* Section Heading */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 p-1.5 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
                Recommended For You
              </h2>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm font-medium">
              Intelligent suggestions customized just for your palate!
            </p>
          </div>
        </div>

        {/* Horizontal Scrolling Carousel Wrapper */}
        <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar scroll-smooth snap-x snap-mandatory">
          {items.map((item, idx) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="flex-shrink-0 w-72 snap-start bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border border-gray-100 dark:border-gray-800/80 rounded-2xl shadow-md p-4 flex flex-col justify-between group hover:shadow-xl hover:border-indigo-500/30 transition-all duration-300"
            >
              <div>
                {/* Food Image */}
                <div className="relative h-40 w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-900">
                  <img
                    src={item.image || "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=600"}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                  />
                  <span className="absolute top-2.5 right-2.5 bg-indigo-600/90 text-white font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1.5 backdrop-blur-sm">
                    <ChefHat className="w-3.5 h-3.5" />
                    {item.category || "Delicacy"}
                  </span>
                </div>

                {/* Details */}
                <div className="mt-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-gray-900 dark:text-white text-base leading-snug line-clamp-1">
                      {item.name}
                    </h3>
                  </div>
                  <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 block mt-0.5">
                    {item.restaurantId?.name || "Flave Partner"}
                  </span>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-2 line-clamp-2 leading-relaxed">
                    {item.description || "Fresh ingredients prepared by top chefs."}
                  </p>
                </div>
              </div>

              {/* Price and Cart Action */}
              <div className="mt-5 flex items-center justify-between border-t border-gray-100/50 dark:border-gray-800/50 pt-3">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 font-semibold uppercase">Price</span>
                  <span className="font-extrabold text-lg text-gray-900 dark:text-white">
                    ₹{item.price}
                  </span>
                </div>

                <button
                  onClick={() => handleAddToCart(item._id)}
                  className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 active:scale-95 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-indigo-500/10 transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
