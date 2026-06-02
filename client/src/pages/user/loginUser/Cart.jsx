import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../config/axiosInstance";
import toast from "react-hot-toast";
import { 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  Ticket, 
  CreditCard, 
  CheckCircle2, 
  Printer, 
  Loader2, 
  ArrowRight,
  Sparkles,
  MapPin
} from "lucide-react";
import qrCodeImg from "../../../assets/qr_code.jpg";

export const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState("");
  
  // Checkout & Payment Modal States
  const [showPayModal, setShowPayModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [paying, setPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  // Card details form
  const [cardDetails, setCardDetails] = useState({
    number: "4242 4242 4242 4242",
    expiry: "12/29",
    cvv: "312",
    name: ""
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token") || localStorage.getItem("authToken");

  const fetchCart = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await axiosInstance.get("/cart/getCart");
      setCart(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
      // Cart not found is 404, which means empty cart, so we can ignore error message in that case
      if (error.response?.status !== 404) {
        toast.error("Failed to load cart.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityIncrease = async (itemId) => {
    try {
      const response = await axiosInstance.post("/cart/addCart", {
        items: [{ menuItem: itemId, quantity: 1 }]
      });
      setCart(response.data);
      toast.success("Item quantity increased");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update cart");
    }
  };

  const handleQuantityDecrease = async (itemId, currentQty) => {
    if (currentQty <= 1) {
      handleRemoveItem(itemId);
      return;
    }
    try {
      const response = await axiosInstance.put("/cart/updateCart", {
        items: [{ menuItem: itemId, quantity: currentQty - 1 }]
      });
      setCart(response.data);
      toast.success("Item quantity decreased");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update cart");
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const response = await axiosInstance.post("/cart/removeitem", {
        menuItem: itemId
      });
      setCart(response.data);
      toast.success("Item removed from cart");
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove item");
    }
  };

  // Coupons
  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === "WELCOME50") {
      const discVal = Math.round(cart.totalPrice * 0.5);
      setDiscount(discVal);
      setAppliedCoupon(code);
      toast.success("50% discount coupon applied successfully!");
    } else if (code === "FLAVEME100") {
      const discVal = cart.totalPrice >= 300 ? 100 : Math.round(cart.totalPrice * 0.1);
      setDiscount(discVal);
      setAppliedCoupon(code);
      toast.success("₹100 discount coupon applied successfully!");
    } else if (code === "HAPPYHOUR") {
      const discVal = Math.round(cart.totalPrice * 0.2);
      setDiscount(discVal);
      setAppliedCoupon(code);
      toast.success("20% discount coupon applied successfully!");
    } else {
      toast.error("Invalid coupon code. Try WELCOME50!");
    }
  };

  const removeCoupon = () => {
    setDiscount(0);
    setAppliedCoupon("");
    setCouponCode("");
    toast.success("Coupon removed");
  };

  // Place order simulated trigger
  const handlePaymentAndCheckout = async (e) => {
    e.preventDefault();
    setPaying(true);
    
    // Simulate Stripe/Razorpay server payment verification delay
    setTimeout(async () => {
      try {
        const response = await axiosInstance.post("/order/createOrder");
        if (response.data?.success) {
          // Store the created order to generate the invoice
          const latestOrders = response.data.orders;
          setCreatedOrder(latestOrders[0]); // Get the placed order details
          setPaymentSuccess(true);
          setCart(null); // Clear cart state locally since backend cleared it
          toast.success("Payment successful! Order processed.");
        } else {
          toast.error("Checkout failed. Please try again.");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error creating order: " + (error.response?.data?.message || error.message));
      } finally {
        setPaying(false);
      }
    }, 2000);
  };

  const printInvoice = () => {
    const printContent = document.getElementById("invoice-printable").innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // Reload window to restore React bindings
  };

  if (!token) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center font-montserrat text-white px-6">
        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6 border border-white/20">
          <ShoppingBag className="w-8 h-8 text-orange-500" />
        </div>
        <h2 className="text-3xl font-extrabold mb-4">Please Log In</h2>
        <p className="text-gray-300 max-w-sm mb-8 text-sm">
          You need to be signed in to view your shopping cart, apply coupons, and checkout.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all text-sm flex items-center gap-2 cursor-pointer"
        >
          Proceed to Login <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-white font-montserrat">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
        <p className="text-sm font-semibold tracking-wider animate-pulse">Loading your cart...</p>
      </div>
    );
  }

  const deliveryFee = cart && cart.items?.length > 0 ? 40 : 0;
  const subtotal = cart ? cart.totalPrice : 0;
  const finalPrice = Math.max(subtotal + deliveryFee - discount, 0);

  return (
    <div className="min-h-screen py-16 font-montserrat text-white px-6 md:px-12 max-w-screen-xl mx-auto">
      <div className="flex items-center gap-3 mb-10">
        <span className="bg-orange-500/10 text-orange-500 p-2 rounded-xl border border-orange-500/20">
          <ShoppingBag className="w-6 h-6" />
        </span>
        <div>
          <h1 className="text-3xl font-extrabold">Your Shopping Cart</h1>
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-0.5">
            Review your delicacies & apply offers
          </p>
        </div>
      </div>

      {!cart || !cart.items || cart.items.length === 0 ? (
        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md max-w-md mx-auto">
          <span className="text-5xl block mb-6">🍽️</span>
          <h2 className="text-2xl font-bold mb-3">Your cart is empty</h2>
          <p className="text-gray-400 text-xs px-8 leading-relaxed mb-8">
            Browse our delicious menus from top local partner restaurants to satisfy your cravings.
          </p>
          <button
            onClick={() => navigate("/rest")}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all text-xs"
          >
            Explore Restaurants
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            {cart.items.map((item) => (
              <div 
                key={item._id}
                className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex items-center justify-between gap-4 group hover:border-orange-500/30 transition-all"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image || "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=600"}
                    alt={item.ItemName || "Food"}
                    className="w-20 h-20 object-cover rounded-xl border border-white/10 shadow-md shrink-0"
                  />
                  <div className="flex flex-col">
                    <h3 className="font-bold text-gray-100 text-base">{item.ItemName || "Gourmet Dish"}</h3>
                    <span className="text-xs text-gray-400 font-semibold mt-1">₹{item.price} each</span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {/* Quantity controls */}
                  <div className="flex items-center bg-white/10 border border-white/20 rounded-xl px-2.5 py-1.5 gap-3.5">
                    <button 
                      onClick={() => handleQuantityDecrease(item.menuItem?._id || item.menuItem, item.quantity)}
                      className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-white active:scale-90 transition-all"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-extrabold text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => handleQuantityIncrease(item.menuItem?._id || item.menuItem)}
                      className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-white active:scale-90 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal & trash */}
                  <div className="flex flex-col items-end">
                    <span className="font-extrabold text-gray-100 text-sm">₹{item.price * item.quantity}</span>
                    <button 
                      onClick={() => handleRemoveItem(item.menuItem?._id || item.menuItem)}
                      className="text-rose-500 hover:text-rose-400 mt-2 p-1 rounded-lg hover:bg-rose-500/10 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout & Bill Summary Panel */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-6">
            <h3 className="font-extrabold text-lg border-b border-white/10 pb-3">Bill Summary</h3>

            {/* Coupons Block */}
            <div className="space-y-3">
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block">Apply Promo Coupon</span>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-emerald-300 font-bold">{appliedCoupon} Applied</span>
                  </div>
                  <button 
                    onClick={removeCoupon}
                    className="text-xs font-bold text-rose-400 hover:text-rose-300 underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter code (e.g. WELCOME50)"
                    className="flex-1 px-3.5 py-2.5 bg-white/10 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-orange-500 focus:bg-white/5 transition-all text-white placeholder-gray-400 font-semibold uppercase"
                  />
                  <button 
                    onClick={applyCoupon}
                    className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 font-bold text-xs rounded-xl active:scale-95 transition-all"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-3 text-sm pt-2">
              <div className="flex justify-between text-gray-300">
                <span>Items Subtotal:</span>
                <span className="font-bold">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Delivery Partner Fee:</span>
                <span className="font-bold">₹{deliveryFee}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Promo Discount:</span>
                  <span className="font-bold">-₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-extrabold border-t border-white/10 pt-3.5">
                <span>Total Amount:</span>
                <span className="text-orange-500">₹{finalPrice}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={() => setShowPayModal(true)}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-500/10 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              Checkout & Place Order <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Simulated Stripe & Razorpay Checkout Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 font-montserrat">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative">
            
            {/* Modal Close Button */}
            {!paying && !paymentSuccess && (
              <button 
                onClick={() => setShowPayModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            )}

            {/* Modal Body */}
            <div className="p-6">
              {!paymentSuccess ? (
                <>
                  <div className="flex items-center gap-2 mb-6">
                    <CreditCard className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-lg font-extrabold">Complete Secure Checkout</h3>
                  </div>

                  {/* Payment Gateway Toggle */}
                  <div className="grid grid-cols-3 gap-2 mb-6 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("stripe")}
                      className={`py-2 rounded-lg font-bold text-[10px] sm:text-xs transition-all ${
                        paymentMethod === "stripe" 
                          ? "bg-indigo-600 text-white border border-indigo-400/50" 
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      💳 Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("razorpay")}
                      className={`py-2 rounded-lg font-bold text-[10px] sm:text-xs transition-all ${
                        paymentMethod === "razorpay" 
                          ? "bg-indigo-600 text-white border border-indigo-400/50" 
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      📲 UPI QR
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("googlepay")}
                      className={`py-2 rounded-lg font-bold text-[10px] sm:text-xs transition-all ${
                        paymentMethod === "googlepay" 
                          ? "bg-indigo-600 text-white border border-indigo-400/50" 
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      🤖 G-Pay
                    </button>
                  </div>

                  {/* Payment Methods Forms */}
                  <form onSubmit={handlePaymentAndCheckout} className="space-y-4">
                    {paymentMethod === "stripe" ? (
                      <div className="space-y-3 bg-slate-900/50 p-4 border border-slate-800 rounded-2xl">
                        <div className="flex flex-col">
                          <label className="text-[10px] text-gray-400 font-semibold uppercase mb-1">Card Number</label>
                          <input 
                            type="text" 
                            value={cardDetails.number}
                            onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                            required
                            className="bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500" 
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col">
                            <label className="text-[10px] text-gray-400 font-semibold uppercase mb-1">Expiry Date</label>
                            <input 
                              type="text" 
                              value={cardDetails.expiry}
                              onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                              required
                              placeholder="MM/YY" 
                              className="bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500" 
                            />
                          </div>
                          <div className="flex flex-col">
                            <label className="text-[10px] text-gray-400 font-semibold uppercase mb-1">CVV</label>
                            <input 
                              type="password" 
                              value={cardDetails.cvv}
                              onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                              required
                              className="bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500" 
                            />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <label className="text-[10px] text-gray-400 font-semibold uppercase mb-1">Cardholder Name</label>
                          <input 
                            type="text" 
                            value={cardDetails.name}
                            onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                            placeholder="AMALDEV HARI"
                            required
                            className="bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500" 
                          />
                        </div>
                      </div>
                    ) : paymentMethod === "razorpay" ? (
                      <div className="bg-slate-900/50 p-4 border border-slate-800 rounded-2xl text-center space-y-4">
                        <span className="text-4xl block">📱</span>
                        <h4 className="text-xs font-bold text-gray-300">Scan QR or enter VPA address</h4>
                        <div className="bg-white p-1 rounded-xl w-36 h-36 mx-auto flex items-center justify-center border-2 border-indigo-500 overflow-hidden shadow-inner">
                          <img 
                            src={qrCodeImg} 
                            alt="Payment QR Code" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <input 
                          type="text" 
                          placeholder="flaveme@upi" 
                          required
                          className="bg-slate-950 border border-slate-800 text-center text-white rounded-lg px-4 py-2 text-xs focus:outline-none focus:border-indigo-500 w-64" 
                        />
                      </div>
                    ) : (
                      /* Google Pay Form */
                      <div className="bg-slate-900/50 p-6 border border-slate-800 rounded-2xl text-center space-y-6">
                        <div className="flex justify-center items-center gap-2">
                          <span className="text-3xl">🤖</span>
                          <span className="text-base font-black tracking-wider text-white">Google Pay</span>
                        </div>
                        <h4 className="text-xs font-bold text-gray-300">Enter Google Pay linked phone number or UPI VPA</h4>
                        
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-full max-w-xs flex flex-col text-left">
                            <label className="text-[10px] text-gray-400 font-semibold uppercase mb-1">G-Pay Mobile Number / UPI ID</label>
                            <input 
                              type="text" 
                              placeholder="9876543210@okaxis" 
                              required
                              className="bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500" 
                            />
                          </div>
                        </div>

                        <div className="bg-black text-white p-3 rounded-xl border border-gray-800 flex items-center justify-center gap-2 max-w-xs mx-auto text-xs font-bold pointer-events-none opacity-85">
                          <span className="text-base">🌐</span> Securely linking Google Pay session
                        </div>
                      </div>
                    )}

                    {/* Total Pay button */}
                    <button
                      type="submit"
                      disabled={paying}
                      className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs rounded-xl shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer mt-6"
                    >
                      {paying ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Verifying Transaction Security...
                        </>
                      ) : (
                        `Pay Total ₹${finalPrice}`
                      )}
                    </button>
                  </form>
                </>
              ) : (
                /* Payment Success & Dynamic Invoice printable card */
                <div className="text-center space-y-6">
                  <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                    <CheckCircle2 className="w-8 h-8 animate-bounce" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-emerald-400">Payment Verified Successfully!</h3>
                    <p className="text-xs text-gray-400 mt-1">Your order has been sent to our autonomous dispatcher.</p>
                  </div>

                  {/* Printable Invoice Component */}
                  <div id="invoice-printable" className="bg-white text-slate-950 p-6 rounded-2xl text-left border border-slate-200 font-mono text-[11px] shadow-sm max-w-sm mx-auto leading-relaxed">
                    <div className="text-center border-b border-dashed border-slate-300 pb-3 mb-3">
                      <h4 className="text-sm font-black tracking-wider text-orange-600 uppercase">FLAVE ME PLATFORM</h4>
                      <p className="text-[9px] text-slate-500 mt-0.5">Clearence Airway Invoice Bill</p>
                    </div>
                    <div className="space-y-1 text-[9px] text-slate-600 mb-3">
                      <p><b>Order ID:</b> {createdOrder?._id}</p>
                      <p><b>Date:</b> {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
                      <p><b>Payment Ref:</b> {paymentMethod.toUpperCase()}_SIM_{Math.random().toString(36).substring(2, 9).toUpperCase()}</p>
                    </div>

                    <div className="border-b border-dashed border-slate-300 pb-2 mb-2 font-bold flex justify-between text-[10px]">
                      <span>Item</span>
                      <span>Total</span>
                    </div>

                    {/* Order items map */}
                    <div className="space-y-1.5 border-b border-dashed border-slate-300 pb-2 mb-2 text-[10px]">
                      {createdOrder?.items ? (
                        createdOrder.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>Item (x{item.quantity})</span>
                            <span>₹{item.price * item.quantity}</span>
                          </div>
                        ))
                      ) : (
                        <div className="flex justify-between">
                          <span>Delicacies Items Combined</span>
                          <span>₹{subtotal}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 text-[10px] text-slate-700">
                      <div className="flex justify-between">
                        <span>Items Subtotal:</span>
                        <span>₹{subtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Partner Fee:</span>
                        <span>₹{deliveryFee}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-emerald-600">
                          <span>Applied Coupon:</span>
                          <span>-₹{discount}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-black text-slate-950 border-t border-dashed border-slate-300 pt-2 text-[11px]">
                        <span>Grand Total Paid:</span>
                        <span>₹{finalPrice}</span>
                      </div>
                    </div>
                    
                    <div className="text-center text-[8px] text-slate-400 mt-4 border-t border-dashed border-slate-200 pt-3">
                      Thank you for choosing Flave Me! Autonomous Drone tracking corridor clear.
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      onClick={printInvoice}
                      className="flex-1 py-3 border border-slate-800 hover:bg-slate-900 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                    >
                      <Printer className="w-4 h-4" /> Print Invoice
                    </button>
                    <button
                      onClick={() => {
                        setShowPayModal(false);
                        navigate(`/user/track-drone/${createdOrder?._id || "latest"}`);
                      }}
                      className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all text-white"
                    >
                      Track with 3D Drone <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};