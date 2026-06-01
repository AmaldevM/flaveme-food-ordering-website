import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { axiosInstance } from "../../config/axiosInstance";
import toast from "react-hot-toast";
import { 
  ArrowRight, ShieldCheck, Truck, Sparkles, Star, MapPin, 
  Smile, ShoppingCart, KeyRound, UserPlus, Info, CheckCircle2 
} from "lucide-react";
import { HowDoesitWork } from "@/components/user/HowDoesitWork";
import { Whychooseus } from "@/components/user/Whychooseus";
import { CravingRoulette } from "@/components/user/CravingRoulette";

// Static dummy items in case DB is empty so the visual experience is rich
const dummyMenuItems = [
  {
    _id: "dummy1",
    name: "Ultimate Double Angus Burger",
    description: "Double grilled flame-seared Angus beef patty, cheddar cheese, secret sauce.",
    price: 699,
    category: "Burgers",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&h=450&q=80",
    restaurantId: { name: "Burger Baron", logo: "BB" }
  },
  {
    _id: "dummy2",
    name: "Classic Pepperoni Pizza",
    description: "Crispy stone-baked crust topped with rich tomato marinara and Mozzarella.",
    price: 899,
    category: "Pizzas",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&h=450&q=80",
    restaurantId: { name: "Pizza Palace", logo: "PP" }
  },
  {
    _id: "dummy3",
    name: "Strawberry Glazed Rainbow Donut",
    description: "Fluffy golden-fried donut coated with sweet strawberry glaze and sprinkles.",
    price: 199,
    category: "Donuts",
    rating: "4.7",
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&h=450&q=80",
    restaurantId: { name: "Donut Dreams", logo: "DD" }
  },
  {
    _id: "dummy4",
    name: "Sparkling Citrus Cooler",
    description: "Tangy fresh-pressed orange juice blend mixed with carbonated club soda.",
    price: 249,
    category: "Drinks",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&h=450&q=80",
    restaurantId: { name: "Citrus Club", logo: "CC" }
  },
  {
    _id: "dummy5",
    name: "Cheesy Garlic Parmesan Wings",
    description: "Crisp-fried chicken wings tossed in rich parmesan cream cheese garlic sauce.",
    price: 499,
    category: "Appetizers",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=600&h=450&q=80",
    restaurantId: { name: "Wing Warehouse", logo: "WW" }
  },
  {
    _id: "dummy6",
    name: "Chocolate Lava Fudge Cake",
    description: "Warm chocolate sponge cake filled with molten premium Belgian fudge center.",
    price: 349,
    category: "Desserts",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&h=450&q=80",
    restaurantId: { name: "Sweet Treats", logo: "ST" }
  }
];

export const Home = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Verification Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedFoodItem, setSelectedFoodItem] = useState(null);
  
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || localStorage.getItem("authToken");
  const isVerified = !!token;

  // Track mouse coordinates for interactive parallax floating effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) * 0.035,
        y: (e.clientY - window.innerHeight / 2) * 0.035,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Fetch all menu items globally
  useEffect(() => {
    const fetchAllMenus = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/menu/all");
        if (response.data.success && response.data.data.length > 0) {
          setMenuItems(response.data.data);
        } else {
          setMenuItems(dummyMenuItems);
        }
      } catch (error) {
        console.error("Error fetching menu items:", error);
        setMenuItems(dummyMenuItems);
      } finally {
        setLoading(false);
      }
    };
    fetchAllMenus();
  }, []);

  // Categories list
  const categories = ["All", "Burgers", "Pizzas", "Donuts", "Drinks", "Desserts"];

  // Filter logic
  const filteredItems = activeCategory === "All" 
    ? menuItems 
    : menuItems.filter(item => item.category?.toLowerCase() === activeCategory.toLowerCase() || item.category === activeCategory);

  // Handle clicking a food item
  const handleItemClick = (item) => {
    if (!isVerified) {
      setSelectedFoodItem(item);
      setShowAuthModal(true);
    } else {
      // User is verified, navigate to details page or add directly to cart
      toast.success(`Opening detailed view for ${item.name}!`);
      // If it's a dummy item, simulate details, otherwise go to restaurant page
      if (item._id.startsWith("dummy")) {
        navigate("/rest");
      } else {
        navigate(`/user/restaurants/${item.restaurantId?._id || item.restaurantId}`);
      }
    }
  };

  const handleAddToCartDirectly = async (e, item) => {
    e.stopPropagation(); // Avoid triggering details modal
    if (!isVerified) {
      setSelectedFoodItem(item);
      setShowAuthModal(true);
      return;
    }

    try {
      const response = await axiosInstance.post("/cart/add", {
        menuId: item._id,
        price: item.price,
      });
      if (response.data.success) {
        toast.success(`${item.name} added to cart!`);
      } else {
        toast.error("Failed to add item to cart.");
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Failed to add to cart.");
    }
  };

  return (
    <div className="space-y-24 pb-20 select-none">
      
      {/* 1. Cinematic Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-6 py-12">
        {/* Parallax Floating Assets */}
        <motion.div 
          animate={{ x: mousePosition.x * -1.2, y: mousePosition.y * -1.2 }}
          className="absolute inset-0 pointer-events-none select-none z-0"
        >
          {/* Flying Pizzas, Drones, Donuts & glow backgrounds */}
          <div className="absolute top-[15%] left-[10%] opacity-40 md:opacity-60 blur-[1px]">
            <span className="text-6xl sm:text-7xl">🍕</span>
          </div>
          <div className="absolute bottom-[25%] left-[8%] opacity-30 md:opacity-50 blur-[2px]">
            <span className="text-5xl sm:text-6xl">🍩</span>
          </div>
          <div className="absolute top-[25%] right-[12%] opacity-40 md:opacity-60 blur-[1.5px]">
            <span className="text-6xl sm:text-7xl">🍔</span>
          </div>
          <div className="absolute bottom-[20%] right-[15%] opacity-35 md:opacity-50 blur-[2px]">
            <span className="text-5xl sm:text-6xl">🥤</span>
          </div>
          {/* Quadcopter delivery drone */}
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
            className="absolute top-[18%] left-[45%] text-5xl md:text-6xl opacity-70 filter drop-shadow-xl"
          >
            🛸
          </motion.div>
        </motion.div>

        <div className="max-w-screen-xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Text Branding */}
          <div className="space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-full text-amber-500 font-extrabold text-xs sm:text-sm tracking-wide uppercase"
            >
              <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: "3s" }} />
              A New Era of Food Ordering
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight font-montserrat"
            >
              Immersive Taste. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                Delivered in Style.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg sm:text-xl text-gray-300 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed"
            >
              Explore handcrafted menus, spin the Craving Roulette to choose your next meal, and track your delivery via futuristic quadcopters.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <a href="#story" className="w-full sm:w-auto">
                <button className="w-full px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold rounded-2xl shadow-lg shadow-orange-500/25 transition-all active:scale-[0.97] flex items-center justify-center gap-2 cursor-pointer">
                  Discover Our Story
                  <ArrowRight className="w-5 h-5" />
                </button>
              </a>
              <a href="#menu-showcase" className="w-full sm:w-auto">
                <button className="w-full px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-extrabold rounded-2xl border border-white/15 transition-all active:scale-[0.97] flex items-center justify-center gap-2 cursor-pointer">
                  View Full Menu
                </button>
              </a>
            </motion.div>
          </div>

          {/* Hero Cinematic Image Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center relative"
          >
            {/* Ambient Background glow bubbles */}
            <div className="absolute top-[20%] w-[320px] h-[320px] bg-orange-600/35 rounded-full blur-[100px] -z-10 animate-pulse" style={{ animationDuration: "5s" }}></div>
            
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="w-full max-w-[480px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] p-6 shadow-2xl relative overflow-hidden glass-card-hover"
            >
              {/* Premium featured banner */}
              <div className="absolute top-4 left-4 bg-emerald-500/20 text-emerald-400 font-extrabold px-3 py-1 rounded-full text-xs tracking-wider border border-emerald-500/30">
                Premium
              </div>
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&h=600&q=80"
                alt="Flave Me Signature Dish"
                className="w-full h-72 sm:h-80 object-cover rounded-3xl shadow-lg border border-white/5 transition-transform duration-500 hover:scale-[1.04]"
              />
              <div className="mt-6 flex justify-between items-center">
                <div>
                  <h4 className="text-xl font-bold text-white font-montserrat">Tender Herb Salmon</h4>
                  <p className="text-gray-300 text-sm mt-1">Baked Norwegian wild salmon</p>
                </div>
                <div className="text-right">
                  <span className="text-amber-400 text-lg font-extrabold block">₹1,249</span>
                  <span className="text-gray-400 text-xs flex items-center gap-1 mt-0.5 justify-end">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-transparent" />
                    4.9
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. Visual Storytelling & Trust Section */}
      <section id="story" className="scroll-mt-24 max-w-screen-xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Brand Vision & Trust */}
        <div className="space-y-6">
          <p className="text-sm font-extrabold text-amber-500 tracking-widest uppercase">Our Mission & Story</p>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight font-montserrat">
            Building Trust, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
              One Plate at a Time.
            </span>
          </h2>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            At **Flave Me**, we believe food ordering should be an experience, not a chore. Established in 2024, our mission is to connect local gastronomic artists with culinary lovers through cutting-edge technology.
          </p>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            We operate under rigid food safety guidelines, verify each partner kitchen, and maintain a 100% trace policy. Our pioneering drone delivery ensures your orders bypass city traffic congestion and land hot, fresh, and contact-free.
          </p>

          {/* Delivery & Security USPs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            <div className="flex gap-4 items-start p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
              <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0 mt-1" />
              <div>
                <h4 className="text-white font-bold text-base">Fully Vetted Kitchens</h4>
                <p className="text-gray-400 text-xs mt-1">Certified food sanitation inspections and ingredient tracing audits.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
              <Truck className="w-8 h-8 text-amber-400 shrink-0 mt-1" />
              <div>
                <h4 className="text-white font-bold text-base">Carbon-Free Transit</h4>
                <p className="text-gray-400 text-xs mt-1">Autonomous electric drone shipping reducing local delivery emissions.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Visual Metrics & Coverage map */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden space-y-8">
          <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-violet-600/10 rounded-full blur-[90px] pointer-events-none"></div>
          
          <h3 className="text-2xl font-bold text-white font-montserrat flex items-center gap-2.5">
            <MapPin className="text-amber-500 w-6 h-6 animate-bounce" />
            Active Delivery Coverage
          </h3>
          
          <p className="text-gray-300 text-sm">
            Our drone docking ports cover **95% of metro zones**, guaranteeing deliveries within **15 minutes** of prep.
          </p>

          {/* Metrics list */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-center border-t border-white/10 pt-8">
            <div>
              <span className="text-3xl sm:text-4xl font-extrabold text-white block font-montserrat">4.9/5</span>
              <span className="text-gray-400 text-xs mt-1.5 flex items-center gap-1 justify-center">
                <Smile className="w-3.5 h-3.5 text-amber-400" />
                User Rating
              </span>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-extrabold text-white block font-montserrat">15 Min</span>
              <span className="text-gray-400 text-xs mt-1.5 flex items-center gap-1 justify-center">
                <Truck className="w-3.5 h-3.5 text-amber-400" />
                Avg Drone Time
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-white block font-montserrat">500+</span>
              <span className="text-gray-400 text-xs mt-1.5 flex items-center gap-1 justify-center">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                Vetted Partners
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Interactive How-it-Works and Why Choose Us sections */}
      <div className="px-6">
        <HowDoesitWork />
        <Whychooseus />
        <CravingRoulette 
          menuItems={menuItems}
          onAddToCartDirectly={handleAddToCartDirectly}
          onItemClick={handleItemClick}
        />
      </div>

      {/* 3. Full-Menu Showcase Catalog */}
      <section id="menu-showcase" className="scroll-mt-24 max-w-screen-xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-4">
          <p className="text-sm font-extrabold text-amber-500 tracking-widest uppercase">Explore Catalog</p>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-montserrat leading-tight">
            Handcrafted <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Flavor Menu</span>
          </h2>
          <p className="text-gray-300 max-w-xl mx-auto text-base sm:text-lg">
            Sift through delicious items from our partner restaurants and order directly. Click any item to begin.
          </p>
        </div>

        {/* Category Tab Bar */}
        <div className="flex justify-center gap-2 overflow-x-auto pb-4 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold border transition-all shrink-0 cursor-pointer ${
                activeCategory === cat
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white border-transparent shadow-lg shadow-orange-500/20"
                  : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Catalog Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <span className="loading loading-spinner text-amber-500 loading-lg"></span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => handleItemClick(item)}
                  className="bg-white/5 dark:bg-black/35 border border-white/10 dark:border-gray-800/40 rounded-3xl p-5 hover:border-amber-500/30 shadow-lg cursor-pointer flex flex-col justify-between glass-card-hover group relative"
                >
                  <div>
                    {/* Visual Card Image */}
                    <div className="relative h-48 w-full overflow-hidden rounded-2xl">
                      <img
                        src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&h=450&q=80"}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                      />
                      {/* Restaurant tag badge */}
                      <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white border border-white/10 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 flex items-center justify-center text-[8px] text-black">
                          {item.restaurantId?.logo || "R"}
                        </span>
                        {item.restaurantId?.name || "Kitchen Partner"}
                      </span>
                    </div>

                    <div className="mt-5 space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors font-montserrat line-clamp-1">
                          {item.name}
                        </h4>
                        <span className="bg-amber-500/10 text-amber-500 text-xs px-2.5 py-1 rounded-full font-bold shrink-0">
                          ★ {item.rating || "4.8"}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
                        {item.description || "Handcrafted fresh ingredients made daily by master culinary chefs."}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between items-center pt-4 border-t border-white/5">
                    <div>
                      <span className="text-gray-400 text-xs block">Price</span>
                      <span className="text-2xl font-extrabold text-white">₹{item.price}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link
                        to={`/ar-visualizer/${item._id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="px-3 py-3 bg-white/5 hover:bg-white/10 text-amber-500 hover:text-amber-400 border border-white/10 font-bold rounded-xl transition-all active:scale-[0.96] flex items-center gap-1.5 cursor-pointer text-xs"
                        title="View in Augmented Reality"
                      >
                        📱 AR
                      </Link>

                      <button
                        onClick={(e) => handleAddToCartDirectly(e, item)}
                        className="px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold rounded-xl shadow-md transition-all active:scale-[0.96] flex items-center gap-2 cursor-pointer text-xs sm:text-sm"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* 4. Onboarding & Verification Dialog (Unauthenticated Item click) */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="w-full max-w-md bg-white/10 dark:bg-black/85 backdrop-blur-xl border border-white/20 dark:border-gray-800/40 rounded-[32px] p-8 shadow-2xl relative overflow-hidden"
            >
              {/* Background glows */}
              <div className="absolute top-[-20%] left-[-20%] w-48 h-48 bg-amber-500/15 rounded-full blur-[80px]"></div>
              
              {/* Close Button */}
              <button 
                onClick={() => {
                  setShowAuthModal(false);
                  setSelectedFoodItem(null);
                }}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors border border-white/10 cursor-pointer"
              >
                ✕
              </button>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-amber-500/20 text-amber-500 rounded-2xl flex items-center justify-center mx-auto border border-amber-500/30">
                  <KeyRound className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-extrabold text-white font-montserrat">Verification Required</h3>
                  <p className="text-gray-300 text-sm px-2">
                    To maintain order authenticity and custom profile tastes, we require verification before proceeding to cart checkout!
                  </p>
                </div>

                {selectedFoodItem && (
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-3 text-left">
                    <img 
                      src={selectedFoodItem.image} 
                      alt={selectedFoodItem.name} 
                      className="w-14 h-14 object-cover rounded-xl shrink-0" 
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wider block">Ordering</span>
                      <h4 className="text-white font-bold text-sm line-clamp-1">{selectedFoodItem.name}</h4>
                      <span className="text-gray-400 text-xs">₹{selectedFoodItem.price}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-2.5 pt-4">
                  <button
                    onClick={() => {
                      setShowAuthModal(false);
                      navigate("/login");
                    }}
                    className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold rounded-xl shadow-lg shadow-orange-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Sign In to Continue
                  </button>

                  <button
                    onClick={() => {
                      setShowAuthModal(false);
                      navigate("/signup");
                    }}
                    className="w-full py-3.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <UserPlus className="w-5 h-5" />
                    Create New Account
                  </button>
                </div>

                <div className="flex justify-center items-center gap-1.5 text-[10px] text-gray-400 pt-2.5">
                  <Info className="w-3.5 h-3.5 text-amber-500" />
                  Your information is secured with bank-grade encryption.
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
