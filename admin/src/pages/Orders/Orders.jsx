import React, { useState, useEffect } from 'react';
import './Orders.css';
import { axiosInstance } from '../../config/axiosInstance';
import { toast } from 'react-toastify';
import parcel_icon from '../../assets/parcel_icon.png';

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);

  // Fetch all orders
  const fetchAllOrders = async () => {
    try {
      const response = await axiosInstance.get('/order/all-orders');
      if (response.data.success) {
        // Sort orders so newest are on top
        const sortedOrders = response.data.orders.reverse();
        setOrders(sortedOrders);
      } else {
        toast.error("Failed to load orders.");
      }
    } catch (error) {
      console.error("Error fetching orders list", error);
      toast.error("Failed to fetch orders list.");
    }
  };

  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value;
    try {
      const response = await axiosInstance.put(`/order/order/${orderId}/status`, {
        status: newStatus
      });
      if (response.data.success) {
        toast.success("Order status updated successfully!");
        await fetchAllOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating status", error);
      toast.error(error.response?.data?.message || "Failed to update order status.");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [url]);

  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.length === 0 ? (
          <p className="no-orders">No orders placed yet.</p>
        ) : (
          orders.map((order, index) => (
            <div key={index} className='order-item'>
              <img src={parcel_icon} alt="Order Icon" className="order-item-icon" />
              <div>
                <p className='order-item-food'>
                  {order.items.map((item, idx) => {
                    if (item.menuItem) {
                      return item.menuItem.name + " x " + item.quantity + (idx === order.items.length - 1 ? "" : ", ");
                    }
                    return "Unknown Item x " + item.quantity + (idx === order.items.length - 1 ? "" : ", ");
                  })}
                </p>
                <p className='order-item-name'>
                  Customer: {order.user ? order.user.name : "Anonymous User"}
                </p>
                <div className='order-item-address'>
                  <p>Email: {order.user ? order.user.email : "N/A"}</p>
                  <p>Phone: {order.user ? order.user.phone : "N/A"}</p>
                </div>
              </div>
              <p>Items: {order.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
              <p className="order-item-price">${order.totalAmount}</p>
              <select onChange={(e) => statusHandler(e, order._id)} value={order.orderStatus ? order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1) : "Pending"}>
                <option value="Pending">Pending</option>
                <option value="Preparing">Preparing</option>
                <option value="Dispatched">Dispatched</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
