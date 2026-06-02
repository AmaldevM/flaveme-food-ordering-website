import React, { useState } from 'react';
import Navbar from './components/Navbar/Navbar.jsx';
import Sidebar from './components/Sidebar/Sidebar.jsx';
import { Routes, Route, Navigate } from 'react-router-dom';
import Add from './pages/Add/Add.jsx';
import List from './pages/List/List.jsx';
import Orders from './pages/Orders/Orders.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import { Login } from './pages/Login/Login.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const url = "http://localhost:4000";

  if (!token) {
    return (
      <div>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        <Login setToken={setToken} />
      </div>
    );
  }

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <Navbar setToken={setToken} />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard url={url} />} />
          <Route path="/add" element={<Add url={url} />} />
          <Route path="/list" element={<List url={url} />} />
          <Route path="/orders" element={<Orders url={url} />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
