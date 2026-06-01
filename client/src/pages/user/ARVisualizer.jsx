import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, Smartphone, ShoppingCart, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";
import { axiosInstance } from "../../config/axiosInstance";

// Hiro Marker SVG/PNG helper display
const HIRO_MARKER_URL = "https://upload.wikimedia.org/wikipedia/commons/4/48/Hiro_marker_ARjs.png";

export default function ARVisualizer() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  
  const [loadingScripts, setLoadingScripts] = useState(true);
  const [showMarkerHelper, setShowMarkerHelper] = useState(false);
  const [itemDetails, setItemDetails] = useState(null);

  // Fetch the current item details to render appropriate model and info
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axiosInstance.get(`/menu/all`);
        if (response.data.success) {
          const item = response.data.data.find(i => i._id === itemId);
          if (item) {
            setItemDetails(item);
          } else {
            // Fallback for dummy items
            const dummyItems = {
              "dummy1": { name: "Angus Burger", category: "Burgers", price: 699 },
              "dummy2": { name: "Pepperoni Pizza", category: "Pizzas", price: 899 },
              "dummy3": { name: "Rainbow Donut", category: "Donuts", price: 199 },
              "dummy4": { name: "Citrus Cooler", category: "Drinks", price: 249 }
            };
            if (dummyItems[itemId]) {
              setItemDetails(dummyItems[itemId]);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching menu item for AR:", err);
      }
    };
    fetchItem();
  }, [itemId]);

  // Handle dynamic loading and unmounting of A-Frame and AR.js scripts
  useEffect(() => {
    const injectScripts = async () => {
      // 1. Inject A-Frame script if not already present
      if (!document.getElementById("aframe-script")) {
        const aframe = document.createElement("script");
        aframe.id = "aframe-script";
        aframe.src = "https://aframe.io/releases/1.3.0/aframe.min.js";
        document.head.appendChild(aframe);
        
        // Wait for aframe script to execute
        await new Promise((resolve) => {
          aframe.onload = resolve;
        });
      }

      // 2. Inject AR.js script if not already present
      if (!document.getElementById("arjs-script")) {
        const arjs = document.createElement("script");
        arjs.id = "arjs-script";
        arjs.src = "https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js";
        document.head.appendChild(arjs);
        
        await new Promise((resolve) => {
          arjs.onload = resolve;
        });
      }

      setLoadingScripts(false);
    };

    injectScripts();

    // Cleanup function when leaving the AR page
    return () => {
      // Stop webcam and release streams
      const videoElements = document.querySelectorAll("video");
      videoElements.forEach((vid) => {
        const stream = vid.srcObject;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop());
        }
        vid.remove();
      });

      // Remove camera feed overlays and classes placed by A-Frame on body/html
      document.body.classList.remove("a-fullscreen");
      const aframeContainers = document.querySelectorAll(".a-canvas, .a-loader-title, .a-enter-vr");
      aframeContainers.forEach((el) => el.remove());

      const uiContextEl = document.querySelector("html");
      if (uiContextEl) {
        uiContextEl.style.removeProperty("overflow");
      }
    };
  }, []);

  const handleAddToCart = async () => {
    if (!itemDetails) return;
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");
      if (!token) {
        toast.error("Please sign in to add items to your cart.");
        navigate("/login");
        return;
      }

      const response = await axiosInstance.post("/cart/add", {
        menuId: itemId.startsWith("dummy") ? "dummy1" : itemId,
        price: itemDetails.price,
      });

      if (response.data.success) {
        toast.success(`${itemDetails.name} added to cart from AR view!`);
      } else {
        toast.error("Failed to add item to cart.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error adding to cart.");
    }
  };

  // Determine model shapes based on category
  const category = (itemDetails?.category || "").toLowerCase();

  const renderARModels = () => {
    if (category.includes("burger")) {
      return (
        <>
          {/* Bun Bottom */}
          <a-cylinder color="#D2B48C" height="0.15" radius="0.5" position="0 0.075 0"></a-cylinder>
          {/* Angus Patty */}
          <a-cylinder color="#5C4033" height="0.15" radius="0.48" position="0 0.225 0"></a-cylinder>
          {/* Cheese Slice */}
          <a-box color="#FFD700" depth="0.65" height="0.02" width="0.65" position="0 0.31 0" rotation="0 45 0"></a-box>
          {/* Lettuce */}
          <a-torus color="#32CD32" radius="0.38" tube="0.06" position="0 0.35 0" rotation="90 0 0"></a-torus>
          {/* Bun Top */}
          <a-sphere color="#D2B48C" radius="0.5" position="0 0.38 0" theta-length="90"></a-sphere>
        </>
      );
    }

    if (category.includes("pizza")) {
      return (
        <>
          {/* Pizza Board / Crust */}
          <a-torus color="#CD853F" radius="0.75" tube="0.06" position="0 0.05 0" rotation="90 0 0"></a-torus>
          {/* Melted Cheese Core */}
          <a-cylinder color="#FFA500" height="0.04" radius="0.7" position="0 0.02 0"></a-cylinder>
          {/* Pepperoni Slices */}
          <a-cylinder color="#B22222" height="0.01" radius="0.08" position="0.3 0.05 0.2" rotation="0 0 0"></a-cylinder>
          <a-cylinder color="#B22222" height="0.01" radius="0.08" position="-0.2 0.05 -0.3" rotation="0 0 0"></a-cylinder>
          <a-cylinder color="#B22222" height="0.01" radius="0.08" position="0.1 0.05 -0.25" rotation="0 0 0"></a-cylinder>
          <a-cylinder color="#B22222" height="0.01" radius="0.08" position="-0.3 0.05 0.1" rotation="0 0 0"></a-cylinder>
        </>
      );
    }

    if (category.includes("donut")) {
      return (
        <>
          {/* Dough Base */}
          <a-torus color="#F4A460" radius="0.5" tube="0.2" position="0 0.2 0" rotation="90 0 0"></a-torus>
          {/* Strawberry Icing Glaze */}
          <a-torus color="#FF69B4" radius="0.5" tube="0.13" position="0 0.24 0" rotation="90 0 0"></a-torus>
          {/* Confetti Sprinkles (Small colored meshes) */}
          <a-box color="#3b82f6" depth="0.03" height="0.03" width="0.1" position="0.25 0.35 0.2" rotation="10 45 30"></a-box>
          <a-box color="#fbbf24" depth="0.03" height="0.03" width="0.1" position="-0.25 0.35 -0.2" rotation="-15 25 -40"></a-box>
          <a-box color="#10b981" depth="0.03" height="0.03" width="0.1" position="0.1 0.36 -0.3" rotation="5 -15 10"></a-box>
        </>
      );
    }

    if (category.includes("drink") || category.includes("cooler") || category.includes("beverage")) {
      return (
        <>
          {/* Clear Acrylic Glass */}
          <a-cylinder color="#FFFFFF" material="opacity: 0.25; transparent: true" height="1.1" radius="0.32" open-ended="true" position="0 0.55 0"></a-cylinder>
          {/* Liquid Core */}
          <a-cylinder color="#FF8C00" height="0.85" radius="0.3" position="0 0.425 0"></a-cylinder>
          {/* Dynamic Drinking Straw */}
          <a-cylinder color="#FF0000" height="1.3" radius="0.025" position="0.12 0.7 0.08" rotation="15 0 20"></a-cylinder>
        </>
      );
    }

    // Default Fallback: Floating holographic star badge
    return (
      <a-entity position="0 0.3 0">
        <a-octahedron color="#f59e0b" radius="0.5" animation="property: rotation; to: 0 360 0; loop: true; dur: 4000; easing: linear"></a-octahedron>
        <a-cylinder color="#ef4444" height="0.1" radius="0.6" position="0 -0.4 0"></a-cylinder>
      </a-entity>
    );
  };

  return (
    <div className="fixed inset-0 z-40 bg-black font-montserrat flex flex-col justify-between overflow-hidden">
      
      {/* 1. Loading screen while A-Frame resources initialize */}
      {loadingScripts && (
        <div className="absolute inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center text-white gap-4">
          <Smartphone className="w-12 h-12 text-amber-500 animate-bounce" />
          <div className="text-center space-y-2">
            <h3 className="text-lg font-bold">Initializing AR Engine...</h3>
            <p className="text-xs text-gray-400">Requesting camera permissions</p>
          </div>
        </div>
      )}

      {/* 2. WebAR Viewer Canvas (via AR.js script custom elements) */}
      {!loadingScripts && (
        <div className="absolute inset-0 w-full h-full z-0">
          <a-scene 
            embedded 
            arjs="sourceType: webcam; debugUIEnabled: false;"
            vr-mode-ui="enabled: false"
            renderer="logarithmicDepthBuffer: true;"
          >
            {/* Hiro Marker anchor detector */}
            <a-marker preset="hiro">
              {/* Load appropriate 3D model */}
              {renderARModels()}
            </a-marker>
            <a-entity camera></a-entity>
          </a-scene>
        </div>
      )}

      {/* 3. Glassmorphic HUD overlay (Z-index 40) */}
      <div className="relative z-10 w-full p-6 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <button
          onClick={() => navigate(-1)}
          className="pointer-events-auto w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-black/70 transition-colors cursor-pointer active:scale-90"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="bg-black/50 backdrop-blur-md border border-white/15 px-5 py-2.5 rounded-2xl flex items-center gap-3 shadow-lg">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div className="text-left">
            <h4 className="text-white font-extrabold text-xs tracking-wider uppercase">Flave AR Portal</h4>
            <p className="text-[10px] text-gray-400 font-semibold">Web Augmented Reality</p>
          </div>
        </div>
      </div>

      {/* Bottom control cards */}
      <div className="relative z-10 w-full p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col gap-4 pointer-events-none items-center">
        
        {/* Helper alert card */}
        <div className="pointer-events-auto bg-black/65 backdrop-blur-md border border-white/10 rounded-2xl p-4 w-full max-w-md shadow-xl text-center flex items-center justify-between gap-3">
          <div className="text-left space-y-1">
            <p className="text-white text-xs font-bold flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-amber-500" />
              Point camera at the Hiro Marker
            </p>
            <p className="text-gray-400 text-[10px] font-medium leading-normal">
              Place the marker on your table or scan it on another display screen to view the 3D food.
            </p>
          </div>
          <button 
            onClick={() => setShowMarkerHelper(true)}
            className="shrink-0 px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white border border-white/10 font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Show Marker
          </button>
        </div>

        {/* Product action card */}
        {itemDetails && (
          <div className="pointer-events-auto bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-5 w-full max-w-md shadow-2xl flex items-center justify-between gap-6">
            <div className="text-left space-y-1">
              <span className="bg-amber-500/20 text-amber-400 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                {itemDetails.category || "Flave Special"}
              </span>
              <h3 className="text-white font-extrabold text-lg leading-tight truncate max-w-[200px]">
                {itemDetails.name}
              </h3>
              <p className="text-white font-black text-xl">₹{itemDetails.price}</p>
            </div>
            
            <button
              onClick={handleAddToCart}
              className="px-5 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold rounded-2xl shadow-lg shadow-orange-500/25 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
        )}
      </div>

      {/* Hiro Marker modal overlay */}
      {showMarkerHelper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 w-full max-w-sm shadow-2xl text-center space-y-6 relative overflow-hidden">
            <button
              onClick={() => setShowMarkerHelper(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              ✕
            </button>

            <div className="space-y-2">
              <h3 className="text-white font-extrabold text-xl">Scan This Marker</h3>
              <p className="text-gray-400 text-xs px-2">
                Open this image on another device, or print it, and point your camera directly at it.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl inline-block shadow-inner">
              <img 
                src={HIRO_MARKER_URL} 
                alt="AR.js Hiro Marker" 
                className="w-48 h-48 mx-auto" 
              />
            </div>

            <button
              onClick={() => setShowMarkerHelper(false)}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
            >
              Got it, start camera!
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
