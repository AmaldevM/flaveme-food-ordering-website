import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, MessageCircle, Heart } from 'lucide-react';
import logo from "../../assets/logo.png";

const Footer = () => {
  return (
    <div className="w-full px-4 select-none mt-16">
      <footer className="mx-auto max-w-7xl glass-panel shadow-2xl rounded-[32px] p-8 md:p-12 text-[var(--text-primary)] transition-all duration-300 relative overflow-hidden">
        {/* Glow decorative spheres */}
        <div className="absolute bottom-[-15%] left-[-10%] w-60 h-60 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute top-[-10%] right-[-10%] w-60 h-60 bg-orange-600/5 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 relative z-10">
          
          {/* Brand Info */}
          <div className="space-y-4 lg:col-span-1 text-center lg:text-left">
            <Link to="/" className="inline-block">
              <img src={logo} className="h-10 w-auto mx-auto lg:mx-0 transition-transform hover:scale-105" alt="FlaveMe logo" />
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-sm mx-auto lg:mx-0">
              Satisfying your hunger with premium vetted local kitchens, futuristic drone deliveries, and interactive 3D menu showcases.
            </p>
          </div>

          {/* Quick Links Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 lg:col-span-3">
            <div>
              <h4 className="text-xs uppercase font-extrabold tracking-wider text-amber-500 dark:text-amber-400 mb-4">Navigations</h4>
              <ul className="space-y-2.5 text-sm font-semibold text-gray-500 dark:text-gray-300">
                <li>
                  <Link to="/" className="hover:text-amber-500 transition-colors">Home</Link>
                </li>
                <li>
                  <Link to="/rest" className="hover:text-amber-500 transition-colors">Restaurants</Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-amber-500 transition-colors">About Us</Link>
                </li>
                <li>
                  <Link to="/contactus" className="hover:text-amber-500 transition-colors">Contact Us</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs uppercase font-extrabold tracking-wider text-amber-500 dark:text-amber-400 mb-4">E-Commerce</h4>
              <ul className="space-y-2.5 text-sm font-semibold text-gray-500 dark:text-gray-300">
                <li>
                  <Link to="/cart" className="hover:text-amber-500 transition-colors">Shopping Cart</Link>
                </li>
                <li>
                  <Link to="/user/wishlist" className="hover:text-amber-500 transition-colors">My Wishlist</Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-amber-500 transition-colors">SignIn Onboarding</Link>
                </li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h4 className="text-xs uppercase font-extrabold tracking-wider text-amber-500 dark:text-amber-400 mb-4">Legal</h4>
              <ul className="space-y-2.5 text-sm font-semibold text-gray-500 dark:text-gray-300">
                <li>
                  <a href="#" className="hover:text-amber-500 transition-colors">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="hover:text-amber-500 transition-colors">Terms of Use</a>
                </li>
                <li>
                  <a href="#" className="hover:text-amber-500 transition-colors">Licensing</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer bottom divider and copy details */}
        <hr className="my-8 border-white/10 dark:border-gray-800/40 relative z-10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            © 2026 <Link to="/" className="hover:underline text-amber-500 dark:text-amber-400 font-bold">FlaveMe™</Link>. Crafted with 
            <Heart className="w-3.5 h-3.5 fill-red-500 stroke-transparent animate-pulse" /> 
            for food lovers.
          </span>
          
          {/* Socials */}
          <div className="flex items-center gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:text-blue-500 text-gray-500 dark:text-gray-300 transition-all hover:scale-110 active:scale-95"
              title="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:text-pink-500 text-gray-500 dark:text-gray-300 transition-all hover:scale-110 active:scale-95"
              title="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:text-sky-500 text-gray-500 dark:text-gray-300 transition-all hover:scale-110 active:scale-95"
              title="Twitter"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:text-indigo-500 text-gray-500 dark:text-gray-300 transition-all hover:scale-110 active:scale-95"
              title="Discord"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
