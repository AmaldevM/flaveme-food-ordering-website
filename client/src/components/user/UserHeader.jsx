import React, { useState, useEffect } from "react";
import { Menu, X, ShoppingCart, Heart, LogOut, User as UserIcon } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { axiosInstance } from "../../config/axiosInstance";
import toast from "react-hot-toast";

export const UserHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userId = localStorage.getItem("userId") || "";
  const navigate = useNavigate();
  const location = useLocation();

  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchCartCount = async () => {
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");
      if (!token) return;
      try {
        const response = await axiosInstance.get("/cart/getCart");
        if (response.data && response.data.items) {
          const totalQty = response.data.items.reduce((acc, curr) => acc + curr.quantity, 0);
          setCartCount(totalQty);
        } else {
          setCartCount(0);
        }
      } catch (error) {
        console.error("Error fetching cart count:", error);
        if (error.response?.status === 404) {
          setCartCount(0);
        }
      }
    };

    fetchCartCount();

    window.addEventListener("cartUpdated", fetchCartCount);
    return () => window.removeEventListener("cartUpdated", fetchCartCount);
  }, []);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/user/logout");
      toast.success("Logged out successfully");
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out. Cleaning up local session...");
      localStorage.clear();
      navigate("/");
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Restaurant", path: "/rest" },
    { name: "Contact Us", path: "/contactus" }
  ];

  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-4 select-none">
      <header className="mx-auto max-w-5xl bg-white/15 dark:bg-black/35 backdrop-blur-xl border border-white/20 dark:border-gray-800/40 shadow-xl rounded-full py-1.5 px-6 text-[var(--text-primary)] transition-all duration-300">
        <div className="flex items-center justify-between h-14">
          
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="Flave Me logo"
              className="w-[90px] md:w-[105px] transition-transform duration-300 ease-in-out hover:scale-[1.08]"
            />
          </Link>

          {/* Desktop Navigation with sliding active pills */}
          <nav className="hidden md:flex items-center space-x-1.5 font-bold text-sm">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 rounded-full transition-all duration-300 flex items-center justify-center group overflow-hidden ${
                    isActive
                      ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-orange-500/20"
                      : "text-gray-700 dark:text-gray-200 hover:bg-white/10 dark:hover:bg-white/5 hover:text-amber-500 dark:hover:text-amber-400"
                  }`}
                >
                  <span className="relative z-10 transition-transform duration-200 group-hover:scale-105">
                    {link.name}
                  </span>
                  {/* Subtle slider highlight line */}
                  {!isActive && (
                    <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-amber-500 dark:bg-amber-400 rounded-full transition-all duration-300 group-hover:w-1/2"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Icons & Avatar Dropdown Area */}
          <div className="hidden md:flex items-center space-x-2.5">
            <Link
              to="/user/wishlist"
              className={`p-2.5 rounded-full transition-all duration-300 hover:bg-white/10 dark:hover:bg-white/5 hover:rotate-[8deg] active:scale-95 ${
                location.pathname === "/user/wishlist"
                  ? "text-red-500 bg-white/10 dark:bg-white/5"
                  : "text-gray-700 dark:text-gray-200 hover:text-red-500"
              }`}
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
            </Link>
            
            <Link
              to="/cart"
              className={`relative p-2.5 rounded-full transition-all duration-300 hover:bg-white/10 dark:hover:bg-white/5 hover:rotate-[8deg] active:scale-95 ${
                location.pathname === "/cart"
                  ? "text-amber-500 bg-white/10 dark:bg-white/5"
                  : "text-gray-700 dark:text-gray-200 hover:text-amber-500"
              }`}
              title="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-amber-500 text-black text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-black shadow-md shadow-orange-500/30">
                  {cartCount}
                </span>
              )}
            </Link>
            
            <ThemeToggle />
            
            <Link to={`/user/profile/${userId}`} title="Profile">
              <Avatar className="border border-white/20 dark:border-gray-800 cursor-pointer w-9 h-9 transition-transform duration-300 hover:scale-110 hover:border-amber-500">
                <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
                <AvatarFallback><UserIcon className="w-4 h-4" /></AvatarFallback>
              </Avatar>
            </Link>

            <button
              onClick={handleLogout}
              className="p-2.5 rounded-full text-gray-700 dark:text-gray-200 hover:bg-white/10 dark:hover:bg-white/5 hover:text-red-500 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer focus:outline-none"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Menu Toggles */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2 text-gray-700 dark:text-gray-200 hover:bg-white/10 dark:hover:bg-white/5 rounded-full transition-colors cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <nav className="md:hidden border-t border-white/10 dark:border-gray-800/40 mt-3 pt-4 pb-2 flex flex-col space-y-2 text-sm font-bold">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block py-2.5 px-4 rounded-xl transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md"
                      : "text-gray-700 dark:text-gray-200 hover:bg-white/10 hover:text-amber-500"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link
              to="/user/wishlist"
              onClick={() => setIsMenuOpen(false)}
              className="py-2.5 px-4 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-white/10 hover:text-red-500 flex items-center gap-2 transition-all"
            >
              <Heart className="w-5 h-5" />
              Wishlist
            </Link>
            <Link
              to="/cart"
              onClick={() => setIsMenuOpen(false)}
              className="py-2.5 px-4 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-white/10 hover:text-amber-500 flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                <span>Cart</span>
              </div>
              {cartCount > 0 && (
                <span className="bg-amber-500 text-black text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              to={`/user/profile/${userId}`}
              onClick={() => setIsMenuOpen(false)}
              className="py-2.5 px-4 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-white/10 hover:text-amber-500 flex items-center gap-2 transition-all"
            >
              <UserIcon className="w-5 h-5" />
              Profile
            </Link>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                handleLogout();
              }}
              className="w-full text-left text-red-500 hover:text-red-600 py-2.5 px-4 flex items-center gap-2 font-bold transition-all cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </nav>
        )}
      </header>
    </div>
  );
};
