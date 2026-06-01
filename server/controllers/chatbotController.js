const { Order } = require("../models/orderModel");
const { Menu } = require("../models/menuModel");
const { Restaurant } = require("../models/restModel");

const chatbotResponse = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const query = message.toLowerCase();
    
    // Check if user is authenticated (from userAuth middleware)
    const userId = req.user ? req.user.id : null;

    // 1. Order Status Intent
    if (
      query.includes("order") || 
      query.includes("track") || 
      query.includes("status") || 
      query.includes("delivery") || 
      query.includes("where is my")
    ) {
      if (!userId) {
        return res.status(200).json({
          reply: "To track your order, please log in first. Once logged in, I can retrieve your latest order status!"
        });
      }

      // Find the latest order for this user
      const latestOrder = await Order.findOne({ user: userId })
        .sort({ createdAt: -1 })
        .populate("items.menuItem")
        .populate("items.restaurant");

      if (!latestOrder) {
        return res.status(200).json({
          reply: "I couldn't find any orders placed by your account. If you just placed one, please wait a moment or make sure you're logged in correctly."
        });
      }

      const orderDate = new Date(latestOrder.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });

      const itemNames = latestOrder.items.map(item => {
        const name = item.menuItem ? item.menuItem.name : "Item";
        return `${name} (x${item.quantity})`;
      }).join(", ");

      const restaurantName = latestOrder.items[0]?.restaurant?.name || "our partner restaurant";

      const statusEmoji = {
        pending: "⏳ Pending Approval",
        preparing: "🍳 Preparing in kitchen",
        dispatched: "🛵 Dispatched / On the way",
        delivered: "✅ Delivered successfully"
      }[latestOrder.orderStatus] || latestOrder.orderStatus;

      return res.status(200).json({
        reply: `Here is the status of your latest order:\n\n**Order ID:** ${latestOrder._id}\n**Placed On:** ${orderDate}\n**Items:** ${itemNames}\n**From:** ${restaurantName}\n**Total Amount:** ₹${latestOrder.totalAmount}\n**Status:** ${statusEmoji}\n\n🚁 **Watch Live Drone Tracking:** [Track Order Live](/user/track-drone/${latestOrder._id})\n\nCan I help you with anything else?`
      });
    }

    // 2. Restaurant Lookup Intent
    if (
      query.includes("restaurant") || 
      query.includes("where is") || 
      query.includes("location") || 
      query.includes("address") || 
      query.includes("find") || 
      query.includes("near") ||
      query.includes("cuisine")
    ) {
      // Find all restaurants to match against
      const restaurants = await Restaurant.find({ isActive: true });
      
      // Check if a specific restaurant name is mentioned in the query
      let matchedRest = null;
      for (const rest of restaurants) {
        if (query.includes(rest.name.toLowerCase())) {
          matchedRest = rest;
          break;
        }
      }

      if (matchedRest) {
        return res.status(200).json({
          reply: `**${matchedRest.name}**\n📍 **Location/Address:** ${matchedRest.address}\n📞 **Phone:** ${matchedRest.phone}\n😋 **Cuisine:** ${matchedRest.cuisine || "Various delicious foods"}\n⭐ **Rating:** ${matchedRest.rating} / 5\n🕒 **Hours:** ${matchedRest.openingHours?.open || "N/A"} - ${matchedRest.openingHours?.close || "N/A"}\n\nWould you like me to find some menu items from ${matchedRest.name}?`
        });
      }

      // If no specific restaurant matched but they asked generally, list top-rated or all restaurants
      const restList = restaurants.slice(0, 5).map(r => `- **${r.name}** (${r.cuisine || "Multi-cuisine"}) - Rated ${r.rating}⭐`).join("\n");
      return res.status(200).json({
        reply: `Here are some of our popular partner restaurants:\n\n${restList}\n\nWhich restaurant would you like to know more about? You can ask "Where is [Restaurant Name]?" or "Tell me about [Restaurant Name]".`
      });
    }

    // 3. Menu / Food Lookup Intent
    if (
      query.includes("menu") || 
      query.includes("food") || 
      query.includes("eat") || 
      query.includes("pizza") || 
      query.includes("burger") || 
      query.includes("donut") || 
      query.includes("drink") || 
      query.includes("beverage") || 
      query.includes("price") || 
      query.includes("cheapest") || 
      query.includes("cost") || 
      query.includes("budget") ||
      query.includes("recommend")
    ) {
      // Check if they want the "cheapest" items
      const isCheapest = query.includes("cheapest") || query.includes("cheap") || query.includes("budget") || query.includes("low cost");
      
      // Identify category if mentioned
      let categoryMatch = null;
      const categories = ["pizza", "burger", "donut", "drink", "beverage", "dessert", "main course", "salad"];
      for (const cat of categories) {
        if (query.includes(cat)) {
          categoryMatch = cat;
          break;
        }
      }

      let findQuery = { availability: true };
      if (categoryMatch) {
        // Find category using a regex (case insensitive)
        findQuery.category = new RegExp(categoryMatch, "i");
      }

      let menuItems = [];
      if (isCheapest) {
        menuItems = await Menu.find(findQuery).sort({ price: 1 }).limit(4).populate("restaurantId");
      } else {
        // Get some items
        menuItems = await Menu.find(findQuery).limit(4).populate("restaurantId");
      }

      if (menuItems.length === 0 && categoryMatch) {
        // Try searching by name if category query returned nothing
        findQuery = { availability: true, name: new RegExp(categoryMatch, "i") };
        menuItems = await Menu.find(findQuery).limit(4).populate("restaurantId");
      }

      if (menuItems.length > 0) {
        const list = menuItems.map((item, idx) => {
          const restName = item.restaurantId?.name ? ` (from ${item.restaurantId.name})` : "";
          return `${idx + 1}. **${item.name}** - ₹${item.price}${restName}\n   _${item.description || "No description available."}_`;
        }).join("\n\n");

        const categoryHeader = categoryMatch ? ` for **${categoryMatch.toUpperCase()}**` : "";
        const sortHeader = isCheapest ? " cheapest" : "";

        return res.status(200).json({
          reply: `Here are some highly recommended${sortHeader} options${categoryHeader} you can order on Flave Me:\n\n${list}\n\nWould you like to search for another dish or restaurant?`
        });
      }

      return res.status(200).json({
        reply: `I couldn't find any menu items matching your query. We serve Burgers, Pizzas, Donuts, Drinks, and much more! Try asking: *"Show me some pizzas"* or *"What is the cheapest burger?"*`
      });
    }

    // 4. General Help / Chat fallback
    return res.status(200).json({
      reply: `👋 Hi! I'm the **Flave Me AI Assistant**.\n\nI can help you navigate our food delivery platform! You can ask me questions like:\n\n💬 *"Where is my order?"* (Track order status)\n💬 *"What is the cheapest pizza?"* (Find budget items)\n💬 *"Where is Cafecrush?"* or *"List some restaurants"* (Locate restaurants)\n💬 *"Recommend some burgers"* (Browse menus)\n\nHow can I help satisfy your cravings today?`
    });

  } catch (error) {
    res.status(500).json({ message: "Chatbot error", error: error.message });
  }
};

module.exports = { chatbotResponse };
