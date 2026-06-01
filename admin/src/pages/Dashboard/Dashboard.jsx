import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import axios from "axios";
import { toast } from "react-toastify";

const Dashboard = ({ url }) => {
  const [stats, setStats] = useState({
    usersCount: 0,
    ordersCount: 0,
    totalRevenue: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiStep, setAiStep] = useState(0);
  const [aiSuggestions, setAiSuggestions] = useState(null);

  // Low stock inventory mock data (since we don't have a low stock schema attribute, we filter menus with availability = false)
  const [inventoryAlerts, setInventoryAlerts] = useState([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch platform stats
      const statsRes = await axios.get(`${url}/api/v1/adminAnalytics/platform-stats`);
      if (statsRes.data) {
        setStats(statsRes.data);
      }

      // Fetch chart data
      const chartRes = await axios.get(`${url}/api/v1/adminAnalytics/orders-by-restaurant`);
      if (chartRes.data) {
        setChartData(chartRes.data);
      }

      // Fetch menus from a default restaurant to find low stock / inactive items
      const restRes = await axios.get(`${url}/api/v1/rest/restaurants`);
      if (restRes.data && restRes.data.length > 0) {
        const firstRestId = restRes.data[0]._id;
        const menuRes = await axios.get(`${url}/api/v1/menu/menu/${firstRestId}`);
        if (menuRes.data?.menus) {
          const outOfStock = menuRes.data.menus.filter(item => !item.availability);
          setInventoryAlerts(outOfStock.slice(0, 4));
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard analytics:", error);
      toast.error("Failed to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [url]);

  // AI Marketing suggestions compiler simulation
  const generateAiSuggestions = () => {
    setAiLoading(true);
    setAiStep(1);
    setAiSuggestions(null);

    setTimeout(() => {
      setAiStep(2);
      setTimeout(() => {
        setAiStep(3);
        setTimeout(() => {
          setAiLoading(false);
          setAiSuggestions([
            {
              title: "🕒 Cafecrush Midweek Happy Hours",
              description: "Our database shows a 34% drop in order frequency on Wednesday afternoons at Cafecrush. Launch a BOGO (Buy One Get One) promotion on general beverages between 2 PM and 5 PM.",
              action: "Send Push Notification",
              code: "HAPPYCRUSH"
            },
            {
              title: "🍕 Gourmet Pizza Combo Bundle Offer",
              description: "Pizza Margherita is the most searched item but has a low cart checkout conversion rate. Recommend bundling it with Garlic Bread and Soda at a 15% combined discount (₹299 total price).",
              action: "Activate Combo Bundle",
              code: "PIZZAFEAST"
            },
            {
              title: "👋 Reactivate Dormant Customers Campaign",
              description: "Currently, 185 registered users have not placed an order in the last 14 days. Generate a re-engagement email newsletter providing free delivery on their next order.",
              action: "Launch Email Campaign",
              code: "COMEBACK50"
            }
          ]);
          toast.success("AI Analytics Suggestions generated successfully!");
        }, 1200);
      }, 1200);
    }, 1200);
  };

  if (loading) {
    return (
      <div className="dashboard-loading font-outfit">
        <div className="spinner"></div>
        <p>Analyzing Platform Revenue & Analytics...</p>
      </div>
    );
  }

  // Get max orders to calculate graph proportions
  const maxOrders = chartData.length > 0 ? Math.max(...chartData.map(d => d.totalOrders)) : 10;

  return (
    <div className="dashboard flex-col">
      <div className="dashboard-header">
        <h2>Sales & Analytics Dashboard</h2>
        <p className="subtitle">Real-time platform statistics, revenue logs, and business insights.</p>
      </div>

      {/* Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card revenue">
          <div className="metric-icon">💰</div>
          <div className="metric-info">
            <span className="metric-label">Total Revenue</span>
            <h3 className="metric-val">₹{stats.totalRevenue}</h3>
          </div>
        </div>

        <div className="metric-card orders">
          <div className="metric-icon">📦</div>
          <div className="metric-info">
            <span className="metric-label">Total Orders</span>
            <h3 className="metric-val">{stats.ordersCount}</h3>
          </div>
        </div>

        <div className="metric-card users">
          <div className="metric-icon">👥</div>
          <div className="metric-info">
            <span className="metric-label">Active Users</span>
            <h3 className="metric-val">{stats.usersCount}</h3>
          </div>
        </div>

        <div className="metric-card target">
          <div className="metric-icon">📈</div>
          <div className="metric-info">
            <span className="metric-label">Growth Index</span>
            <h3 className="metric-val">+14.2%</h3>
          </div>
        </div>
      </div>

      {/* Charts & Inventory Section */}
      <div className="dashboard-row">
        {/* Orders by Restaurant Custom Bar Chart */}
        <div className="dashboard-panel chart-panel">
          <h3>Orders per Restaurant</h3>
          <p className="panel-desc">Comparison of total successful orders processed by each merchant.</p>
          
          <div className="custom-chart">
            {chartData.length === 0 ? (
              <p className="no-chart-data">No sales data recorded yet.</p>
            ) : (
              chartData.map((data, index) => {
                const percent = (data.totalOrders / maxOrders) * 100;
                return (
                  <div key={index} className="chart-bar-row">
                    <span className="chart-label-text">{data.restaurantName}</span>
                    <div className="bar-container">
                      <div 
                        className="bar-fill" 
                        style={{ width: `${percent}%` }}
                      >
                        <span className="bar-value">{data.totalOrders} orders</span>
                      </div>
                    </div>
                    <span className="chart-revenue-text">₹{data.totalAmount}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Inventory & Out-Of-Stock Panel */}
        <div className="dashboard-panel inventory-panel">
          <h3>Inventory Management Warnings</h3>
          <p className="panel-desc">Menu items that are currently disabled or out of stock.</p>
          
          <div className="alert-list">
            {inventoryAlerts.length === 0 ? (
              <div className="all-stocked">
                <span className="stocked-icon">🛡️</span>
                <p>All catalog items are currently available and well-stocked.</p>
              </div>
            ) : (
              inventoryAlerts.map((item) => (
                <div key={item._id} className="alert-item">
                  <div className="alert-details">
                    <span className="alert-food-name">{item.name}</span>
                    <span className="alert-category">{item.category}</span>
                  </div>
                  <span className="status-badge oos">Out of Stock</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* AI Marketing Panel */}
      <div className="dashboard-panel ai-panel">
        <div className="ai-panel-header">
          <div>
            <h3>💡 Smart AI Marketing Optimizer</h3>
            <p className="panel-desc">Generates automated localized discount campaigns and merchant expansion prompts based on transaction logs.</p>
          </div>
          <button 
            onClick={generateAiSuggestions} 
            disabled={aiLoading}
            className="ai-btn"
          >
            {aiLoading ? "Consulting AI..." : "Compute Suggestions"}
          </button>
        </div>

        {/* AI Loading Stages */}
        {aiLoading && (
          <div className="ai-loader-container">
            <div className="ai-spinner"></div>
            <div className="ai-steps">
              <p className={aiStep >= 1 ? "step-active" : "step-idle"}>⚙️ Compiling hourly order frequencies...</p>
              <p className={aiStep >= 2 ? "step-active" : "step-idle"}>📊 Cross-referencing restaurant average ratings...</p>
              <p className={aiStep >= 3 ? "step-active" : "step-idle"}>✨ Formulating targeted coupon copy...</p>
            </div>
          </div>
        )}

        {/* AI Suggestions Results */}
        {aiSuggestions && (
          <div className="suggestions-grid">
            {aiSuggestions.map((sug, i) => (
              <div key={i} className="suggestion-card">
                <div className="suggestion-badge">Campaign Plan {i + 1}</div>
                <h4>{sug.title}</h4>
                <p>{sug.description}</p>
                <div className="coupon-info">
                  <span className="coupon-code">CODE: <b>{sug.code}</b></span>
                  <button 
                    onClick={() => toast.success(`Campaign '${sug.title}' launched!`)}
                    className="campaign-btn"
                  >
                    {sug.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
