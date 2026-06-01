const mongoose = require("mongoose");
const { Restaurant } = require("../models/restModel");
const { Menu } = require("../models/menuModel");
require("dotenv").config({ path: "../.env" }); // Load env variables from server/.env

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://amaldevhari265:DelkwG8Jv3xItGwp@cluster0.mvrlmli.mongodb.net/";

const seedDatabase = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully!");

    // Clear existing data (optional but ensures clean starting seed)
    console.log("Clearing old restaurants and menus...");
    await Restaurant.deleteMany({});
    await Menu.deleteMany({});

    console.log("Seeding Demo Restaurants...");
    const restaurants = await Restaurant.insertMany([
      {
        name: "Burger Baron",
        description: "Flame-grilled signature burgers and loaded seasoned fries.",
        address: "Block 5, Indiranagar, Bangalore",
        phone: "+91 99887 76655",
        cuisine: "Burgers & Fast Food",
        rating: 4.9,
        isActive: true,
        image: ["https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&h=450&q=80"]
      },
      {
        name: "Pizza Palace",
        description: "Artisanal stone-baked pizzas with organic tomatoes and fresh mozzarella.",
        address: "7th Cross, HSR Layout, Bangalore",
        phone: "+91 99887 76644",
        cuisine: "Italian & Pizzas",
        rating: 4.8,
        isActive: true,
        image: ["https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&h=450&q=80"]
      },
      {
        name: "Donut Dreams",
        description: "Handcrafted glazed donuts, pastries, and premium hot beverages.",
        address: "Port 2, Koramangala, Bangalore",
        phone: "+91 99887 76633",
        cuisine: "Desserts & Bakeries",
        rating: 4.7,
        isActive: true,
        image: ["https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&h=450&q=80"]
      }
    ]);

    console.log("Seeding Demo Menu items...");
    
    // Burger Baron Menu Items
    const burgerBaron = restaurants[0];
    const pizzaPalace = restaurants[1];
    const donutDreams = restaurants[2];

    const menuItems = [
      // Burger Baron items
      {
        restaurantId: burgerBaron._id,
        name: "Ultimate Double Angus Burger",
        description: "Double grilled flame-seared Angus beef patty, cheddar cheese, fresh ruffled lettuce, and our secret burger sauce.",
        price: 699,
        category: "Burgers",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&h=450&q=80",
        availability: true
      },
      {
        restaurantId: burgerBaron._id,
        name: "Cheddar Bacon Crisp Burger",
        description: "Angus beef patty, crispy hickory smoked bacon, cheddar sauce, toasted sesame seed bun.",
        price: 549,
        category: "Burgers",
        image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=600&h=450&q=80",
        availability: true
      },

      // Pizza Palace items
      {
        restaurantId: pizzaPalace._id,
        name: "Classic Pepperoni Pizza",
        description: "Crispy stone-baked crust topped with rich tomato marinara, layers of Mozzarella, and seasoned beef pepperoni.",
        price: 899,
        category: "Pizzas",
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&h=450&q=80",
        availability: true
      },
      {
        restaurantId: pizzaPalace._id,
        name: "Garden Fresh Veggie Pizza",
        description: "Topped with bell peppers, green olives, mushrooms, cherry tomatoes, and red onions with dynamic herb drizzle.",
        price: 749,
        category: "Pizzas",
        image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=600&h=450&q=80",
        availability: true
      },

      // Donut Dreams items
      {
        restaurantId: donutDreams._id,
        name: "Strawberry Glazed Rainbow Donut",
        description: "Fluffy golden-fried donut coated with sweet strawberry glaze and decorated with rainbow sprinkles.",
        price: 199,
        category: "Donuts",
        image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&h=450&q=80",
        availability: true
      },
      {
        restaurantId: donutDreams._id,
        name: "Double Chocolate Lava Donut",
        description: "Soft glazed cocoa donut stuffed with sweet liquid Belgian chocolate filling.",
        price: 249,
        category: "Donuts",
        image: "https://images.unsplash.com/photo-1612240498936-65f5101365d2?auto=format&fit=crop&w=600&h=450&q=80",
        availability: true
      },

      // Drinks
      {
        restaurantId: burgerBaron._id,
        name: "Sparkling Citrus Cooler",
        description: "Tangy fresh-pressed orange citrus blend mixed with carbonated club soda and solid crystal ice.",
        price: 249,
        category: "Drinks",
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&h=450&q=80",
        availability: true
      },
      {
        restaurantId: donutDreams._id,
        name: "Premium Hot Latte",
        description: "Freshly pulled double espresso shot with steamed whole milk and velvety microfoam layer.",
        price: 299,
        category: "Drinks",
        image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&h=450&q=80",
        availability: true
      }
    ];

    await Menu.insertMany(menuItems);
    console.log("Database seeded successfully with demo restaurants and menu items!");
    process.exit(0);
  } catch (error) {
    console.error("Database seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();
