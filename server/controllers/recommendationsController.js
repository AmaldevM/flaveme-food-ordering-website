const { Order } = require("../models/orderModel");
const { Menu } = require("../models/menuModel");

const getRecommendations = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;

    // Default recommendations if guest or no orders
    const defaultRecommendations = async () => {
      // Return 6 available items from different categories to showcase variety
      return await Menu.find({ availability: true })
        .populate("restaurantId")
        .limit(6);
    };

    if (!userId) {
      const items = await defaultRecommendations();
      return res.status(200).json(items);
    }

    // Retrieve user's order history with menu item details populated
    const userOrders = await Order.find({ user: userId }).populate("items.menuItem");

    if (!userOrders || userOrders.length === 0) {
      const items = await defaultRecommendations();
      return res.status(200).json(items);
    }

    // Count categories and track items already ordered
    const categoryCounts = {};
    const orderedItemIds = new Set();

    userOrders.forEach(order => {
      order.items.forEach(item => {
        if (item.menuItem) {
          orderedItemIds.add(item.menuItem._id.toString());
          const cat = item.menuItem.category;
          if (cat) {
            categoryCounts[cat] = (categoryCounts[cat] || 0) + item.quantity;
          }
        }
      });
    });

    // Find favorite category (the one with the highest order quantity count)
    let favoriteCategory = null;
    let maxCount = 0;
    Object.entries(categoryCounts).forEach(([cat, count]) => {
      if (count > maxCount) {
        maxCount = count;
        favoriteCategory = cat;
      }
    });

    if (!favoriteCategory) {
      const items = await defaultRecommendations();
      return res.status(200).json(items);
    }

    // Find items in favorite category that the user has not ordered yet
    let recommendedItems = await Menu.find({
      availability: true,
      category: favoriteCategory,
      _id: { $nin: Array.from(orderedItemIds) }
    })
      .populate("restaurantId")
      .limit(6);

    // If we have fewer than 4 recommended items, fill the list with other items from their favorite category (even if ordered before)
    if (recommendedItems.length < 4) {
      const additionalItems = await Menu.find({
        availability: true,
        category: favoriteCategory,
        _id: { $in: Array.from(orderedItemIds) } // already ordered
      })
        .populate("restaurantId")
        .limit(6 - recommendedItems.length);

      recommendedItems = [...recommendedItems, ...additionalItems];
    }

    // If still short of 6 items, append default general recommendations
    if (recommendedItems.length < 6) {
      const currentIds = recommendedItems.map(item => item._id.toString());
      const generalItems = await Menu.find({
        availability: true,
        _id: { $nin: currentIds }
      })
        .populate("restaurantId")
        .limit(6 - recommendedItems.length);

      recommendedItems = [...recommendedItems, ...generalItems];
    }

    res.status(200).json(recommendedItems);
  } catch (error) {
    res.status(500).json({ message: "Error generating recommendations", error: error.message });
  }
};

module.exports = { getRecommendations };
