const mongoose = require("mongoose");
const { Restaurant } = require("../models/restModel");
const { Menu } = require("../models/menuModel");
require("dotenv").config();

// Mappings for Unsplash High-Quality Food Pictures to match items
const foodImages = {
  biryani: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&h=450&q=80",
  mandi: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&h=450&q=80",
  rice: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&h=450&q=80",
  burger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&h=450&q=80",
  shawarma: "https://images.unsplash.com/photo-1642699269417-742a781b9542?auto=format&fit=crop&w=600&h=450&q=80",
  sandwich: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&h=450&q=80",
  wrap: "https://images.unsplash.com/photo-1626700051175-6518c4793f4f?auto=format&fit=crop&w=600&h=450&q=80",
  hotdog: "https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=600&h=450&q=80",
  fries: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&h=450&q=80",
  nuggets: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&h=450&q=80",
  pizza: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&h=450&q=80",
  fried_chicken: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=600&h=450&q=80",
  wings: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=600&h=450&q=80",
  kerala: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&h=450&q=80",
  chinese: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&h=450&q=80",
  momos: "https://images.unsplash.com/photo-1625220194771-7ebedd0b70b4?auto=format&fit=crop&w=600&h=450&q=80",
  street: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&h=450&q=80",
  salad: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&h=450&q=80",
  cake: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&h=450&q=80",
  dessert: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&h=450&q=80",
  brownie: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?auto=format&fit=crop&w=600&h=450&q=80",
  juice: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&h=450&q=80",
  coffee: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&h=450&q=80",
  garlic_bread: "https://images.unsplash.com/photo-1573145959986-89d89163013d?auto=format&fit=crop&w=600&h=450&q=80"
};

// Restaurants to Seed
const targetRestaurants = [
  { name: "Velvet Restaurant", cuisine: "Street Food & Chaats", description: "Premium vegetarian dining, special chaat layout, and Malabar style delicacies.", phone: "9876540001", address: "12, High Street Main, Zone A", rating: 4.8 },
  { name: "Crumbz Cafe", cuisine: "Café & Desserts", description: "Warm coffee brews, freshly baked cookies, pastries, and loaded club sandwiches.", phone: "9876540002", address: "44, Park Avenue Road, Circle C", rating: 4.7 },
  { name: "Arabian Palace", cuisine: "Mandi & Biryani Corner", description: "The authentic home of Kuzhimanthi, Hyderabadi Dum Biryanis, and Alfaham.", phone: "9876540003", address: "9B, Fort Highway Bypass, Sector 4", rating: 4.9 },
  { name: "Burger Hub", cuisine: "Fast Food & Wraps", description: "Flame-grilled chicken and beef burgers, zinger wraps, and hot crispy fries.", phone: "9876540004", address: "81, Express Market Square", rating: 4.6 },
  { name: "Pizza Point", cuisine: "Pizzas & Garlic Breads", description: "Wood-fired artisanal pizzas, cheese bursts, and authentic Italian marinara bases.", phone: "9876540005", address: "22, Skyline Walkway, Sector B", rating: 4.7 },
  { name: "Chinese Wok", cuisine: "Asian & Noodles", description: "Authentic Schezwan noodles, dim sums, Chilli Chicken, and delicious ramen bowls.", phone: "9876540006", address: "3, Metro Arcade, Ground Floor", rating: 4.5 },
  { name: "Kerala Kitchen", cuisine: "Kerala Traditional Specials", description: "Porotta & Beef Roast, Kappa & Fish Curry, traditional meals served on banana leaves.", phone: "9876540007", address: "55, coconut Grove Bypass Road", rating: 4.8 },
  { name: "BBQ Nation", cuisine: "Crispy Fried & BBQ Chicken", description: "KFC style crispy fried chicken, spicy glazed wings, and live table grates.", phone: "9876540008", address: "702, Zenith Mall, 3rd Floor", rating: 4.9 },
  { name: "Healthy Bowl", cuisine: "Healthy Salads & Bowls", description: "Macro-balanced organic salads, high-protein chicken bowls, and cold smoothies.", phone: "9876540009", address: "14, Wellness Center Lane, Sector A", rating: 4.7 },
  { name: "Sweet Treats", cuisine: "Desserts, Faloodas & Shakes", description: "Creamy faloodas, tender coconut milkshakes, cheesecakes, and sweet gulab jamuns.", phone: "9876540010", address: "5, Lake View Promenade, Circle A", rating: 4.8 }
];

// Menu Items to Seed
const targetMenuItems = [
  // 1. Biryani & Rice Corner -> category: "Biryani & Rice"
  { name: "Chicken Biryani", price: 249, category: "Biryani & Rice", description: "Fragrant basmati rice cooked with layered spiced chicken, caramelised onions, and ghee.", image: foodImages.biryani, restName: "Arabian Palace" },
  { name: "Beef Biryani", price: 269, category: "Biryani & Rice", description: "Traditional Malabar style beef biryani packed with aromatic spices and small-grain Kaima rice.", image: foodImages.biryani, restName: "Kerala Kitchen" },
  { name: "Mutton Biryani", price: 349, category: "Biryani & Rice", description: "Premium tender mutton chunks layered with long-grain basmati and exotic spices.", image: foodImages.biryani, restName: "Arabian Palace" },
  { name: "Hyderabadi Dum Biryani", price: 279, category: "Biryani & Rice", description: "Slow-cooked dum biryani with marinated chicken, saffron, and spices in Hyderabad style.", image: foodImages.biryani, restName: "Arabian Palace" },
  { name: "Kuzhimanthi", price: 299, category: "Biryani & Rice", description: "Yemeni style rice cooked with steam-rendered spice chicken inside an underground pit.", image: foodImages.mandi, restName: "Arabian Palace" },
  { name: "Alfaham Mandi", price: 319, category: "Biryani & Rice", description: "Flame-grilled coal Alfaham chicken served on a platter of rich, aromatic Mandi rice.", image: foodImages.mandi, restName: "Arabian Palace" },
  { name: "Ghee Rice", price: 149, category: "Biryani & Rice", description: "Short-grain Kaima rice roasted in pure ghee and topped with fried raisins and cashews.", image: foodImages.rice, restName: "Kerala Kitchen" },
  { name: "Fried Rice", price: 189, category: "Biryani & Rice", description: "Stir-fried rice tossed with spring onions, shredded carrots, eggs, and authentic soy sauce.", image: foodImages.rice, restName: "Chinese Wok" },
  { name: "Chicken Pulav", price: 219, category: "Biryani & Rice", description: "Mildly spiced chicken and vegetable rice cooked in a single pot with whole spices.", image: foodImages.rice, restName: "Kerala Kitchen" },
  { name: "Jeera Rice", price: 129, category: "Biryani & Rice", description: "Steamed basmati rice tempered with toasted cumin seeds and clarified butter.", image: foodImages.rice, restName: "Kerala Kitchen" },

  // 2. Fast Food -> category: "Fast Food"
  { name: "Zinger Burger", price: 199, category: "Fast Food", description: "Crispy batter-fried chicken breast fillet topped with crunchy lettuce and mayonnaise.", image: foodImages.burger, restName: "Burger Hub" },
  { name: "Chicken Burger", price: 169, category: "Fast Food", description: "Grilled minced chicken patty layered with cheddar cheese, tomatoes, and burger sauce.", image: foodImages.burger, restName: "Burger Hub" },
  { name: "Beef Burger", price: 189, category: "Fast Food", description: "Juicy flame-grilled double beef patty served with caramelized onions and pickles.", image: foodImages.burger, restName: "Burger Hub" },
  { name: "Cheese Burger", price: 179, category: "Fast Food", description: "MINI cheeseburger containing beef patty, double cheddar cheese slices, and mustard.", image: foodImages.burger, restName: "Burger Hub" },
  { name: "Shawarma", price: 129, category: "Fast Food", description: "Authentic Lebanese style rolled wrap stuffed with grilled chicken, garlic paste, and fries.", image: foodImages.shawarma, restName: "Arabian Palace" },
  { name: "Club Sandwich", price: 189, category: "Fast Food", description: "Triple-decker sandwich layered with grilled chicken, omelette, tomatoes, and cheese.", image: foodImages.sandwich, restName: "Crumbz Cafe" },
  { name: "Chicken Wrap", price: 159, category: "Fast Food", description: "Strips of crispy zinger chicken wrapped inside a toasted tortilla with spicy salsa.", image: foodImages.wrap, restName: "Burger Hub" },
  { name: "Hot Dog", price: 149, category: "Fast Food", description: "Grilled premium chicken sausage served inside a soft sliced bun with relish and mustard.", image: foodImages.hotdog, restName: "Burger Hub" },
  { name: "French Fries", price: 99, category: "Fast Food", description: "Golden, crisp salted potato fingers served with tomato ketchup.", image: foodImages.fries, restName: "Burger Hub" },
  { name: "Nuggets", price: 129, category: "Fast Food", description: "Ten pieces of crispy tempura-battered minced chicken nuggets with dipping sauce.", image: foodImages.nuggets, restName: "Burger Hub" },

  // 3. Pizza Hub -> category: "Pizzas"
  { name: "Margherita Pizza", price: 299, category: "Pizzas", description: "Classic stone-baked pizza crust topped with rich tomato sauce, Mozzarella, and fresh basil.", image: foodImages.pizza, restName: "Pizza Point" },
  { name: "Veg Pizza", price: 329, category: "Pizzas", description: "Loaded with black olives, green bell peppers, sweet corn, red onions, and mushrooms.", image: foodImages.pizza, restName: "Pizza Point" },
  { name: "Chicken Tikka Pizza", price: 399, category: "Pizzas", description: "Smoky tandoori chicken tikka chunks, sliced green chillies, and coriander toppings.", image: foodImages.pizza, restName: "Pizza Point" },
  { name: "Pepperoni Pizza", price: 449, category: "Pizzas", description: "Spicy Italian pepperoni slices layered generously on a bed of bubbling mozzarella cheese.", image: foodImages.pizza, restName: "Pizza Point" },
  { name: "BBQ Chicken Pizza", price: 389, category: "Pizzas", description: "Sweet and tangy hickory BBQ sauce base topped with grilled chicken strips and red onions.", image: foodImages.pizza, restName: "Pizza Point" },
  { name: "Cheese Burst Pizza", price: 479, category: "Pizzas", description: "Signature crust loaded with liquid cheddar cheese that oozes out with every slice.", image: foodImages.pizza, restName: "Pizza Point" },

  // 4. KFC Style Chicken -> category: "Fried Chicken"
  { name: "Crispy Fried Chicken", price: 229, category: "Fried Chicken", description: "Signature golden-fried chicken leg piece with a super flaky and crunchy batter.", image: foodImages.fried_chicken, restName: "BBQ Nation" },
  { name: "Hot & Spicy Chicken", price: 239, category: "Fried Chicken", description: "Crispy chicken breast tenders tossed in a spicy, fiery cayenne pepper seasoning.", image: foodImages.fried_chicken, restName: "BBQ Nation" },
  { name: "Chicken Wings", price: 199, category: "Fried Chicken", description: "Six pieces of juicy chicken wings fried to crisp perfection and glazed in hot sauce.", image: foodImages.wings, restName: "BBQ Nation" },
  { name: "Chicken Strips", price: 179, category: "Fried Chicken", description: "Boneless, tender chicken strips breaded and fried golden, served with garlic dip.", image: foodImages.fried_chicken, restName: "BBQ Nation" },
  { name: "Popcorn Chicken", price: 149, category: "Fried Chicken", description: "Bite-sized chicken nuggets seasoned in herbs and fried till highly crunchy.", image: foodImages.fried_chicken, restName: "BBQ Nation" },
  { name: "Chicken Bucket", price: 699, category: "Fried Chicken", description: "Large sharing bucket containing 8 pieces of crispy fried chicken and dips.", image: foodImages.fried_chicken, restName: "BBQ Nation" },

  // 5. Kerala Specials -> category: "Kerala Specials"
  { name: "Porotta & Beef Curry", price: 220, category: "Kerala Specials", description: "Three layered, flaky Kerala porottas served with a spicy, rich beef coconut-fry gravy.", image: foodImages.kerala, restName: "Kerala Kitchen" },
  { name: "Kappa & Fish Curry", price: 240, category: "Kerala Specials", description: "Boiled mashed tapioca seasoned with coconut, paired with traditional red-chilli fish curry.", image: foodImages.kerala, restName: "Kerala Kitchen" },
  { name: "Appam & Stew", price: 199, category: "Kerala Specials", description: "Two lacy, soft-centered rice hoppers served with vegetable and potato coconut stew.", image: foodImages.kerala, restName: "Kerala Kitchen" },
  { name: "Puttu & Kadala Curry", price: 120, category: "Kerala Specials", description: "Steamed cylindrical rice cake layered with coconut, served with black chickpea curry.", image: foodImages.kerala, restName: "Kerala Kitchen" },
  { name: "Kerala Meals", price: 180, category: "Kerala Specials", description: "Traditional rice served with sambar, avial, thoran, rasam, curd, payasam, and papadum.", image: foodImages.kerala, restName: "Kerala Kitchen" },
  { name: "Fish Pollichathu", price: 349, category: "Kerala Specials", description: "Pearl spot fish marinated in spicy masala, wrapped in banana leaves, and pan-seared.", image: foodImages.kerala, restName: "Kerala Kitchen" },
  { name: "Malabar Chicken Curry", price: 230, category: "Kerala Specials", description: "Chicken cooked in a roasted coconut paste gravy with Malabar spices and curry leaves.", image: foodImages.kerala, restName: "Kerala Kitchen" },

  // 6. Chinese & Asian -> category: "Chinese"
  { name: "Chicken Noodles", price: 199, category: "Chinese", description: "Hakka style egg noodles stir-fried with chicken shreds, bell peppers, and cabbage.", image: foodImages.chinese, restName: "Chinese Wok" },
  { name: "Schezwan Noodles", price: 209, category: "Chinese", description: "Spicy noodles tossed in a home-style Schezwan pepper garlic sauce with chicken.", image: foodImages.chinese, restName: "Chinese Wok" },
  { name: "Chicken Fried Rice", price: 199, category: "Chinese", description: "Stir-fried rice tossed with egg scrambles, chicken chunks, and green onions.", image: foodImages.rice, restName: "Chinese Wok" },
  { name: "Dragon Chicken", price: 249, category: "Chinese", description: "Crispy chicken strips tossed in a sweet-spicy red sauce with cashews and onions.", image: foodImages.chinese, restName: "Chinese Wok" },
  { name: "Chilli Chicken", price: 229, category: "Chinese", description: "Classic Indo-Chinese style chicken cubes tossed with capsicum, onions, and green chillies.", image: foodImages.chinese, restName: "Chinese Wok" },
  { name: "Manchurian", price: 189, category: "Chinese", description: "Deep-fried vegetable balls simmered in a dark soy garlic gravy.", image: foodImages.chinese, restName: "Chinese Wok" },
  { name: "Momos", price: 149, category: "Chinese", description: "Six pieces of steamed dumplings filled with minced chicken and served with spicy chutney.", image: foodImages.momos, restName: "Chinese Wok" },
  { name: "Ramen", price: 329, category: "Chinese", description: "A hot soup bowl of wheat noodles, soft boiled egg, chicken slices, and green nori.", image: foodImages.chinese, restName: "Chinese Wok" },

  // 7. Street Food -> category: "Street Food"
  { name: "Pani Puri", price: 80, category: "Street Food", description: "Ten crispy hollow puris filled with spiced potato, tamarind sauce, and spicy mint water.", image: foodImages.street, restName: "Velvet Restaurant" },
  { name: "Pav Bhaji", price: 130, category: "Street Food", description: "Thick vegetable curry mash served with buttered soft bread rolls and raw onions.", image: foodImages.street, restName: "Velvet Restaurant" },
  { name: "Vada Pav", price: 60, category: "Street Food", description: "The classic Mumbai burger: deep-fried potato dumpling inside a soft bun with dry garlic chutney.", image: foodImages.street, restName: "Velvet Restaurant" },
  { name: "Dabeli", price: 70, category: "Street Food", description: "Spicy potato mix filled inside a pav roll, garnished with pomegranate seeds and sev.", image: foodImages.street, restName: "Velvet Restaurant" },
  { name: "Samosa", price: 40, category: "Street Food", description: "Two triangular pastries stuffed with spiced potatoes and peas, fried till crisp.", image: foodImages.street, restName: "Velvet Restaurant" },
  { name: "Chaat Items", price: 110, category: "Street Food", description: "A delicious mixed plate of Papdi Chaat topped with curd, sev, and sweet tamarind chutney.", image: foodImages.street, restName: "Velvet Restaurant" },

  // 8. Healthy Foods -> category: "Healthy"
  { name: "Caesar Salad", price: 199, category: "Healthy", description: "Crisp Romaine lettuce tossed in Caesar dressing, crunchy croutons, and grated parmesan.", image: foodImages.salad, restName: "Healthy Bowl" },
  { name: "Greek Salad", price: 219, category: "Healthy", description: "Sliced cucumbers, ripe tomatoes, red onions, kalamata olives, and a large slab of Feta cheese.", image: foodImages.salad, restName: "Healthy Bowl" },
  { name: "Protein Bowl", price: 289, category: "Healthy", description: "Quinoa base topped with grilled tofu, roasted broccoli, edamame, and sesame dressing.", image: foodImages.salad, restName: "Healthy Bowl" },
  { name: "Fruit Bowl", price: 179, category: "Healthy", description: "Assortment of fresh seasonal fruits, berries, and pomegranate seeds dressed in lime-honey.", image: foodImages.salad, restName: "Healthy Bowl" },
  { name: "Grilled Chicken Salad", price: 269, category: "Healthy", description: "Warm sliced chicken breast served over a bed of baby spinach, cherry tomatoes, and vinaigrette.", image: foodImages.salad, restName: "Healthy Bowl" },
  { name: "Smoothie Bowl", price: 229, category: "Healthy", description: "Creamy blended acai and blueberry base topped with chia seeds, banana slices, and granola.", image: foodImages.salad, restName: "Healthy Bowl" },

  // 9. Desserts -> category: "Desserts"
  { name: "Chocolate Cake", price: 149, category: "Desserts", description: "Rich triple-chocolate sponge layer cake topped with dark cocoa fudge icing.", image: foodImages.cake, restName: "Sweet Treats" },
  { name: "Cheesecake", price: 189, category: "Desserts", description: "New York style baked cheesecake served with a rich sweet strawberry reduction drizzle.", image: foodImages.cake, restName: "Sweet Treats" },
  { name: "Brownie", price: 99, category: "Desserts", description: "Fudgy premium chocolate brownie loaded with chopped walnuts and chocolate chips.", image: foodImages.brownie, restName: "Sweet Treats" },
  { name: "Donut", price: 89, category: "Desserts", description: "Soft raised yeast donut coated with pink strawberry glaze and rainbow sprinkles.", image: foodImages.dessert, restName: "Sweet Treats" },
  { name: "Ice Cream", price: 79, category: "Desserts", description: "Double scoop of premium vanilla bean ice cream served with chocolate syrup.", image: foodImages.dessert, restName: "Sweet Treats" },
  { name: "Falooda", price: 169, category: "Desserts", description: "Layered rose syrup dessert drink containing vermicelli, basil seeds, milk, and vanilla ice cream scoop.", image: foodImages.dessert, restName: "Sweet Treats" },
  { name: "Gulab Jamun", price: 79, category: "Desserts", description: "Three soft fried milk-solid balls soaked in warm sweet cardamom sugar syrup.", image: foodImages.dessert, restName: "Sweet Treats" },
  { name: "Kunafa", price: 299, category: "Desserts", description: "Traditional Middle Eastern crispy shredded kataifi pastry stuffed with melted mozzarella cheese and syrup.", image: foodImages.dessert, restName: "Arabian Palace" },

  // 10. Beverages -> category: "Beverages"
  { name: "Fresh Lime Juice", price: 59, category: "Beverages", description: "Chilled fresh-squeezed lime juice served sweet, salted, or mixed.", image: foodImages.juice, restName: "Sweet Treats" },
  { name: "Mojito", price: 129, category: "Beverages", description: "Refreshing carbonated cooler made with fresh lime chunks, muddled mint leaves, and ice.", image: foodImages.juice, restName: "Crumbz Cafe" },
  { name: "Cold Coffee", price: 119, category: "Beverages", description: "Rich double-shot espresso blended with chilled milk and a scoop of vanilla ice cream.", image: foodImages.coffee, restName: "Crumbz Cafe" },
  { name: "Milkshake", price: 139, category: "Beverages", description: "Thick chocolate milkshake blended with vanilla ice cream and dark cocoa fudge.", image: foodImages.juice, restName: "Sweet Treats" },
  { name: "Smoothies", price: 159, category: "Beverages", description: "Chilled blended fresh bananas, strawberries, and low-fat yogurt.", image: foodImages.juice, restName: "Healthy Bowl" },
  { name: "Soft Drinks", price: 49, category: "Beverages", description: "Chilled carbonated soft drink served in a tin can.", image: foodImages.juice, restName: "Burger Hub" },
  { name: "Tender Coconut Shake", price: 149, category: "Beverages", description: "Thick milk shake blended with sweet pulp and water of fresh tender coconuts.", image: foodImages.juice, restName: "Sweet Treats" },

  // 11. Café Menu -> category: "Café"
  { name: "Cappuccino", price: 109, category: "Café", description: "Single espresso shot topped with equal parts steamed milk and rich thick milk foam.", image: foodImages.coffee, restName: "Crumbz Cafe" },
  { name: "Latte", price: 119, category: "Café", description: "Mild coffee brew containing double shot espresso blended with steamed milk and a thin foam cap.", image: foodImages.coffee, restName: "Crumbz Cafe" },
  { name: "Espresso", price: 79, category: "Café", description: "Concentrated straight double shot of premium roasted Arabica coffee beans.", image: foodImages.coffee, restName: "Crumbz Cafe" },
  { name: "Iced Coffee", price: 129, category: "Café", description: "Espresso shot poured over ice and mixed with cold whole milk and sweet syrup.", image: foodImages.coffee, restName: "Crumbz Cafe" },
  { name: "Garlic Bread", price: 119, category: "Café", description: "Four toasted bread slices brushed with garlic-infused olive butter and parsley.", image: foodImages.garlic_bread, restName: "Pizza Point" },
  { name: "Brownie with Ice Cream", price: 169, category: "Café", description: "Warm fudge walnut brownie served with vanilla ice cream scoop and dark cocoa drizzle.", image: foodImages.brownie, restName: "Crumbz Cafe" }
];

async function seedDatabase() {
  console.log("Connecting to MongoDB Database...");
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected successfully!");



    const restaurantMap = {};

    // 1. Seed Restaurants
    console.log(`Seeding ${targetRestaurants.length} Restaurants...`);
    for (const rest of targetRestaurants) {
      let existingRest = await Restaurant.findOne({ name: rest.name });
      if (!existingRest) {
        existingRest = new Restaurant(rest);
        await existingRest.save();
        console.log(`+ Created Restaurant: "${rest.name}"`);
      } else {
        // Update to make sure description and details are matching
        existingRest.cuisine = rest.cuisine;
        existingRest.description = rest.description;
        existingRest.phone = rest.phone;
        existingRest.address = rest.address;
        await existingRest.save();
        console.log(`* Verified Restaurant: "${rest.name}"`);
      }
      restaurantMap[rest.name] = existingRest._id;
    }

    // 2. Seed Menu Items
    console.log(`Seeding ${targetMenuItems.length} Menu Items...`);
    let addedCount = 0;
    for (const item of targetMenuItems) {
      const restaurantId = restaurantMap[item.restName];
      if (!restaurantId) {
        console.warn(`! Missing restaurant ID for: "${item.restName}", skipping menu "${item.name}"`);
        continue;
      }

      // Check if menu already exists
      const existingMenu = await Menu.findOne({ restaurantId, name: item.name });
      if (!existingMenu) {
        const newMenu = new Menu({
          restaurantId,
          name: item.name,
          price: item.price,
          category: item.category,
          description: item.description,
          image: item.image,
          availability: true
        });
        await newMenu.save();
        addedCount++;
      }
    }

    console.log(`\n=================================================`);
    console.log(`🎉 SUCCESS: Database seeding complete!`);
    console.log(`- Created/Verified ${Object.keys(restaurantMap).length} Restaurants`);
    console.log(`- Added ${addedCount} new Menu Items to the catalog`);
    console.log(`=================================================`);
    process.exit(0);

  } catch (error) {
    console.error("Critical error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
