import React, { useState } from "react";
import { ArrowRight, Menu, X, ShoppingCart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import ThemeToggle from "../ui/ThemeToggle";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Restaurant", path: "/rest" },
    { name: "About", path: "/about" },
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

          {/* Desktop Navigation with sliding pill design and line extensions */}
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
                  {/* Subtle underline slider line */}
                  {!isActive && (
                    <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-amber-500 dark:bg-amber-400 rounded-full transition-all duration-300 group-hover:w-1/2"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Icons & Action buttons */}
          <div className="hidden md:flex items-center space-x-3.5">
            <Link
              to="/cart"
              className="p-2.5 rounded-full text-gray-700 dark:text-gray-200 hover:bg-white/10 dark:hover:bg-white/5 hover:text-amber-500 dark:hover:text-amber-400 transition-all duration-300 hover:rotate-[8deg] active:scale-95"
              title="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
            </Link>
            <ThemeToggle />
            
            <Link to="/login">
              <div className="font-lato group relative cursor-pointer px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-bold rounded-full overflow-hidden text-center transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 active:scale-95">
                <span className="translate-x-0 group-hover:translate-x-12 group-hover:opacity-0 transition-all duration-300 inline-block">
                  SignIn
                </span>
                <div className="flex gap-1.5 text-white z-10 items-center absolute inset-0 w-full h-full justify-center translate-x-12 opacity-0 group-hover:-translate-x-0 group-hover:opacity-100 transition-all duration-300">
                  <span>Get Start</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
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
              to="/cart"
              onClick={() => setIsMenuOpen(false)}
              className="py-2.5 px-4 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-white/10 hover:text-amber-500 flex items-center gap-2 transition-all"
            >
              <ShoppingCart className="w-5 h-5" />
              Cart
            </Link>
            <Link
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="inline-block pt-2"
            >
              <button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 rounded-xl shadow-lg transition-colors cursor-pointer">
                Sign In
              </button>
            </Link>
          </nav>
        )}
      </header>
    </div>
  );
}

export default Header;
