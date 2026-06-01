import React, { useState, useEffect } from 'react';
import Header from "../components/user/Header";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/user/Footer";
import { UserHeader } from "@/components/user/UserHeader";
import AIChatbot from "../components/user/AIChatbot";


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
      <div className='min-h-96'> 
        <Outlet />
      </div>
      <AIChatbot />
      <Footer />
    </div>
  );
};
