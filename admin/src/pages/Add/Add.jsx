import React, { useState, useEffect } from 'react';
import './Add.css';
import { axiosInstance } from '../../config/axiosInstance';
import { toast } from 'react-toastify';
import upload_area from '../../assets/upload_area.png';

const Add = ({ url }) => {
  const [image, setImage] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [data, setData] = useState({
    restaurantId: "",
    name: "",
    description: "",
    price: "",
    category: "Biryani & Rice"
  });

  // Fetch all restaurants for the dropdown selection
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axiosInstance.get('/rest/restaurants');
        if (response.data && response.data.length > 0) {
          setRestaurants(response.data);
          // Set first restaurant as default
          setData(prev => ({ ...prev, restaurantId: response.data[0]._id }));
        } else {
          toast.warning("Please create a restaurant first before adding menu items.");
        }
      } catch (error) {
        console.error("Error fetching restaurants", error);
        toast.error("Failed to fetch restaurants list.");
      }
    };
    fetchRestaurants();
  }, [url]);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!image) {
      toast.error("Image not selected");
      return;
    }
    if (!data.restaurantId) {
      toast.error("Restaurant selection is required");
      return;
    }

    const formData = new FormData();
    formData.append("restaurantId", data.restaurantId);
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("image", image);

    try {
      const response = await axiosInstance.post('/menu/create-menu', formData);
      if (response.data.success) {
        setData({
          restaurantId: restaurants.length > 0 ? restaurants[0]._id : "",
          name: "",
          description: "",
          price: "",
          category: "Biryani & Rice"
        });
        setImage(false);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error submitting menu item", error);
      toast.error(error.response?.data?.message || "Failed to add menu item.");
    }
  };

  return (
    <div className='add'>
      <form className='flex-col' onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img src={image ? URL.createObjectURL(image) : upload_area} alt="Upload Preview" />
          </label>
          <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden required />
        </div>
        
        <div className="add-restaurant flex-col">
          <p>Select Restaurant</p>
          <select onChange={onChangeHandler} name="restaurantId" value={data.restaurantId} required>
            {restaurants.map((res) => (
              <option key={res._id} value={res._id}>{res.name}</option>
            ))}
          </select>
        </div>

        <div className="add-product-name flex-col">
          <p>Product Name</p>
          <input onChange={onChangeHandler} value={data.name} type="text" name="name" placeholder='Type here' required />
        </div>

        <div className="add-product-description flex-col">
          <p>Product Description</p>
          <textarea onChange={onChangeHandler} value={data.description} name="description" rows="6" placeholder='Write content here' required></textarea>
        </div>

        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product Category</p>
            <select onChange={onChangeHandler} name="category" value={data.category}>
              <option value="Biryani & Rice">Biryani & Rice</option>
              <option value="Fast Food">Fast Food</option>
              <option value="Pizzas">Pizzas</option>
              <option value="Fried Chicken">Fried Chicken</option>
              <option value="Kerala Specials">Kerala Specials</option>
              <option value="Chinese">Chinese</option>
              <option value="Street Food">Street Food</option>
              <option value="Healthy">Healthy</option>
              <option value="Desserts">Desserts</option>
              <option value="Beverages">Beverages</option>
              <option value="Café">Café</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Product Price</p>
            <input onChange={onChangeHandler} value={data.price} type="number" name='price' placeholder='$20' required min="1" />
          </div>
        </div>

        <button type='submit' className='add-btn'>ADD DISH</button>
      </form>
    </div>
  );
};

export default Add;
