import React, { useState, useEffect } from 'react';
import Header from "../components/user/Header";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/user/Footer";
import { UserHeader } from "@/components/user/UserHeader";
import AIChatbot from "../components/user/AIChatbot";
import { motion, AnimatePresence } from "framer-motion";


export function UserLayout() {
  const [isUserAuth, setIsUserAuth] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("authToken");
    setIsUserAuth(!!token);
  }, [location]);

  return (
    <div>
      {isUserAuth ? <UserHeader /> : <Header />}
      <div className='min-h-96 overflow-hidden'> 
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
      <AIChatbot />
      <Footer />
    </div>
  );
};
