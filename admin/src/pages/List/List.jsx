import React, { useState, useEffect } from 'react';
import './List.css';
import { axiosInstance } from '../../config/axiosInstance';
import { toast } from 'react-toastify';

const List = ({ url }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestId, setSelectedRestId] = useState("");
  const [list, setList] = useState([]);
  
  // Edit modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCategory, setEditCategory] = useState("Burgers");
  const [editImage, setEditImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState("");

  // Fetch all restaurants
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axiosInstance.get('/rest/restaurants');
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
      const response = await axiosInstance.get(`/menu/menu/${restaurantId}`);
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
      const response = await axiosInstance.delete(`/menu/remove-menu/${foodId}`);
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

  const openEditModal = (item) => {
    setCurrentItem(item);
    setEditName(item.name);
    setEditDescription(item.description || "");
    setEditPrice(item.price);
    setEditCategory(item.category || "Burgers");
    setEditImage(null);
    setEditImagePreview(item.image || "");
    setIsEditModalOpen(true);
  };

  const handleUpdateFood = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", editName);
    formData.append("description", editDescription);
    formData.append("price", Number(editPrice));
    formData.append("category", editCategory);
    if (editImage) {
      formData.append("image", editImage);
    }

    try {
      const response = await axiosInstance.put(`/menu/update-menu/${currentItem._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.data.success) {
        toast.success("Menu item updated successfully!");
        setIsEditModalOpen(false);
        fetchList(selectedRestId);
      } else {
        toast.error(response.data.message || "Failed to update item.");
      }
    } catch (error) {
      console.error("Error updating menu item", error);
      toast.error(error.response?.data?.message || "Failed to update menu item.");
    }
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
              <div className="action-buttons flex gap-2">
                <button onClick={() => openEditModal(item)} className='edit-btn cursor'>Edit</button>
                <p onClick={() => removeFood(item._id)} className='cursor delete-btn'>X</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal Overlay */}
      {isEditModalOpen && (
        <div className="edit-modal-overlay">
          <div className="edit-modal">
            <div className="edit-modal-header">
              <h3>Edit Menu Item</h3>
              <button className="close-modal-btn" onClick={() => setIsEditModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleUpdateFood} className="edit-modal-form">
              <div className="form-group">
                <label>Item Name</label>
                <input 
                  type="text" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)} 
                  required 
                  placeholder="Enter name"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  value={editDescription} 
                  onChange={(e) => setEditDescription(e.target.value)} 
                  rows="3" 
                  placeholder="Enter description"
                />
              </div>
              <div className="form-group">
                <label>Price ($)</label>
                <input 
                  type="number" 
                  value={editPrice} 
                  onChange={(e) => setEditPrice(e.target.value)} 
                  required 
                  placeholder="Enter price"
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)}>
                  <option value="Burgers">Burgers</option>
                  <option value="Pizzas">Pizzas</option>
                  <option value="Donuts">Donuts</option>
                  <option value="Drinks">Drinks</option>
                  <option value="Desserts">Desserts</option>
                </select>
              </div>
              <div className="form-group">
                <label>Upload New Image (Optional)</label>
                <div className="image-upload-preview">
                  {editImagePreview && (
                    <img src={editImagePreview} alt="Preview" className="edit-preview-img" />
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setEditImage(file);
                        setEditImagePreview(URL.createObjectURL(file));
                      }
                    }} 
                  />
                </div>
              </div>
              <button type="submit" className="submit-btn">Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
