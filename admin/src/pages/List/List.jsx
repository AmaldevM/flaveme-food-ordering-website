import React, { useState, useEffect } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const List = ({ url }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestId, setSelectedRestId] = useState("");
  const [list, setList] = useState([]);

  // Fetch all restaurants
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(`${url}/api/v1/rest/restaurants`);
        if (response.data && response.data.length > 0) {
          setRestaurants(response.data);
          setSelectedRestId(response.data[0]._id);
        }
      } catch (error) {
        console.error("Error fetching restaurants", error);
        toast.error("Failed to load restaurants list.");
      }
    };
    fetchRestaurants();
  }, [url]);

  // Fetch menu items when selected restaurant changes
  const fetchList = async (restaurantId) => {
    if (!restaurantId) return;
    try {
      const response = await axios.get(`${url}/api/v1/menu/menu/${restaurantId}`);
      if (response.data.success) {
        setList(response.data.menus);
      } else {
        setList([]);
      }
    } catch (error) {
      console.error("Error fetching menu list", error);
      // If 404, it means no menus found, which is fine, just set list to empty
      if (error.response?.status === 404) {
        setList([]);
      } else {
        toast.error("Failed to fetch menu list.");
      }
    }
  };

  useEffect(() => {
    fetchList(selectedRestId);
  }, [selectedRestId]);

  const removeFood = async (foodId) => {
    try {
      const response = await axios.delete(`${url}/api/v1/menu/remove-menu/${foodId}`);
      if (response.data.success) {
        toast.success(response.data.message);
        // Refresh the list
        await fetchList(selectedRestId);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting menu item", error);
      toast.error(error.response?.data?.message || "Failed to delete menu item.");
    }
  };

  const handleRestaurantChange = (e) => {
    setSelectedRestId(e.target.value);
  };

  return (
    <div className='list flex-col'>
      <div className="list-header flex-col">
        <p>All Foods List</p>
        <div className="restaurant-filter">
          <span>Filter by Restaurant: </span>
          <select onChange={handleRestaurantChange} value={selectedRestId}>
            <option value="">Select Restaurant</option>
            {restaurants.map((res) => (
              <option key={res._id} value={res._id}>{res.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.length === 0 ? (
          <p className="no-items">No menu items found for this restaurant.</p>
        ) : (
          list.map((item, index) => (
            <div key={index} className='list-table-format'>
              <img src={item.image || `${url}/images/placeholder.png`} alt={item.name} className="list-food-img" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>${item.price}</p>
              <p onClick={() => removeFood(item._id)} className='cursor delete-btn'>X</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default List;
