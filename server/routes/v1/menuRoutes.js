const express = require("express");
const { upload } = require("../../middlewares/multer");
const {
  createMenuItem,
  getMenusByCategory,
  searchMenuByName,
  filterMenusByPrice,
  updateMenu,
  deleteMenu,
  getMenubyRestaurantid,
  getAllMenuItems
} = require("../../controllers/menuController");

const router = express.Router();

// Get all menus globally
router.get("/all", getAllMenuItems);

// Create menu
router.post("/create-menu", upload.single("image"), createMenuItem);
// Get menus by restaurant id
router.get("/menu/:restaurantId", getMenubyRestaurantid);
// Get menu by category
router.get("/menu/:restaurantId/category/:category", getMenusByCategory);
// Search menu by name
router.get("/menu/:restaurantId/search", searchMenuByName);
// Filter menu by price
router.get("/menu/:restaurantId/filter/price", filterMenusByPrice);
// Update menu 
router.put("/update-menu/:menuId", upload.single("image"), updateMenu);
// delete menu
router.delete("/remove-menu/:menuId", deleteMenu);

module.exports = { menuRouter: router };
