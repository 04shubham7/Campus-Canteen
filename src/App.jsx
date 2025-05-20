// TESTING123
import React, { useState, useEffect } from "react";
import { menuItems as defaultMenuItems } from "./data/menu";
import Menu from "./components/Menu";
import Cart from "./components/Cart";
import OrderConfirmation from "./components/OrderConfirmation";
import OrderHistory from "./components/OrderHistory";
import AdminMenu from "./components/AdminMenu";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";

const ADMIN_EMAIL = "shubham040711@gmail.com"; // Change to your admin's email

function App() {
  // Navigation: 'menu', 'history', 'admin'
  const [currentPage, setCurrentPage] = useState("menu");

  // Menu state (editable by admin)
  const [menu, setMenu] = useState([]);

  // Cart and order state
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [order, setOrder] = useState(null);

  // Order history
  const [orderHistory, setOrderHistory] = useState([]);

  // Add phone number state
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPhonePrompt, setShowPhonePrompt] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(false);

  const { user } = useUser();

  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("campusCanteenDarkMode");
    return stored ? JSON.parse(stored) : false;
  });

  useEffect(() => {
    localStorage.setItem("campusCanteenDarkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Load menu and order history from localStorage
  useEffect(() => {
    try {
      const storedMenu = localStorage.getItem("campusCanteenMenu");
      if (storedMenu) {
        const parsedMenu = JSON.parse(storedMenu);
        if (Array.isArray(parsedMenu) && parsedMenu.length > 0) {
          setMenu(parsedMenu);
        } else {
          setMenu(defaultMenuItems);
        }
      } else {
        setMenu(defaultMenuItems);
      }
      
      const storedHistory = localStorage.getItem("campusCanteenOrderHistory");
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory);
        if (Array.isArray(parsedHistory)) {
          setOrderHistory(parsedHistory);
        }
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      setMenu(defaultMenuItems);
      setOrderHistory([]);
    }
  }, []);

  // Save menu to localStorage when changed
  useEffect(() => {
    try {
      if (menu && menu.length > 0) {
        localStorage.setItem("campusCanteenMenu", JSON.stringify(menu));
      }
    } catch (error) {
      console.error("Error saving menu to localStorage:", error);
    }
  }, [menu]);

  // Save order history to localStorage when changed
  useEffect(() => {
    try {
      if (orderHistory && orderHistory.length > 0) {
        localStorage.setItem("campusCanteenOrderHistory", JSON.stringify(orderHistory));
      }
    } catch (error) {
      console.error("Error saving order history to localStorage:", error);
    }
  }, [orderHistory]);

  // Cart logic
  const handleAddToCart = (item) => {
    if (!user) {
      // Show sign in prompt
      alert("Please sign in to add items to cart");
      return;
    }
    setCart((prev) => {
      const found = prev.find((i) => i.id === item.id);
      if (found) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
    setCartOpen(true);
  };

  const handleIncrement = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrement = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemove = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handlePlaceOrder = () => {
    if (!user) {
      alert("Please sign in to place an order");
      return;
    }
    if (!phoneNumber || phoneNumber.length < 8) {
      setShowPhonePrompt(true);
      setPendingOrder(true);
      return;
    }
    setOrder(cart);
    setOrderHistory((prev) => [
      { 
        id: Date.now(), 
        items: cart, 
        date: new Date().toISOString(),
        userId: user.id,
        userEmail: user.primaryEmailAddress?.emailAddress,
        phoneNumber: phoneNumber
      },
      ...prev
    ]);
    setCart([]);
    setCartOpen(false);
  };

  // Handle phone number submission
  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 8) return;
    setShowPhonePrompt(false);
    if (pendingOrder) {
      setPendingOrder(false);
      handlePlaceOrder();
    }
  };

  const handleCloseOrder = () => {
    setOrder(null);
  };

  // Navigation bar
  const navButton = (page, label) => (
    <button
      className={`nav-link mr-2 relative transition-colors duration-300 ${
        currentPage === page ? "active" : ""
      }`}
      onClick={() => setCurrentPage(page)}
    >
      <span className="relative z-10">{label}</span>
      <span
        className={`absolute left-2 right-2 -bottom-1 h-0.5 rounded bg-orange-400 transition-all duration-300 ${
          currentPage === page ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
        }`}
        style={{ transformOrigin: "left" }}
      />
    </button>
  );

  const isAdmin = user && user.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;

  return (
    <div className={"min-h-screen " + (darkMode ? "bg-gray-900" : "bg-gray-100") + " transition-colors duration-300"}>
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-400 dark:from-orange-700 dark:via-yellow-600 dark:to-orange-600 shadow-lg rounded-b-2xl p-6 flex items-center justify-between sticky top-0 z-30 transition-all duration-300">
        <h1 className="text-3xl font-extrabold text-white drop-shadow select-none tracking-tight">CampusCanteen</h1>
        <div className="flex items-center gap-2 sm:gap-4">
          {navButton("menu", "Menu")}
          <SignedIn>
            {!isAdmin && navButton("history", "Order History")}
          </SignedIn>
          {isAdmin && navButton("admin", "Admin")}
          <SignedIn>
            {!isAdmin && (
              <button
                className="relative ml-2 sm:ml-4 hover:scale-110 transition-transform duration-200"
                onClick={() => setCartOpen(true)}
                aria-label="Open cart"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-white dark:text-gray-200"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25A3.75 3.75 0 0011.25 18h1.5a3.75 3.75 0 003.75-3.75V6.75m-9 7.5h9m-9 0l-1.5-6.75m10.5 6.75l1.5-6.75m-12 0h15.75"
                  />
                </svg>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 shadow-lg">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
            )}
          </SignedIn>
          {/* Dark mode toggle button */}
          <button
            className="ml-2 sm:ml-4 p-2 rounded-full bg-white/20 dark:bg-gray-900/30 hover:bg-white/40 dark:hover:bg-gray-900/50 transition border border-white/30 dark:border-gray-900/40 shadow"
            onClick={() => setDarkMode((prev) => !prev)}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.95l-.71.71M21 12h-1M4 12H3m16.66 6.66l-.71-.71M4.05 4.05l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white dark:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
              </svg>
            )}
          </button>
          <SignedIn>
            <UserButton appearance={{ elements: { avatarBox: "ring-2 ring-white dark:ring-orange-400" } }} />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal" />
          </SignedOut>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {currentPage === "menu" && (
          <div>
            <SignedOut>
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-orange-700">
                      Please sign in to place orders and view your order history.
                    </p>
                  </div>
                </div>
              </div>
            </SignedOut>
            <Menu menuItems={menu} onAddToCart={handleAddToCart} />
          </div>
        )}
        {currentPage === "history" && (
          <SignedIn>
            <OrderHistory 
              orderHistory={orderHistory.filter(order => order.userId === user?.id)} 
            />
          </SignedIn>
        )}
        {currentPage === "admin" && isAdmin && (
          <AdminMenu 
            menu={menu} 
            setMenu={setMenu} 
            orderHistory={orderHistory} 
          />
        )}
        {currentPage === "admin" && !isAdmin && (
          <div className="text-center text-red-500 text-xl mt-10">You are not authorized to view this page.</div>
        )}
      </main>

      {/* Cart Sidebar */}
      <SignedIn>
        {!isAdmin && cartOpen && (
          <Cart
            cartItems={cart}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            onRemove={handleRemove}
            onPlaceOrder={handlePlaceOrder}
            onClose={() => setCartOpen(false)}
          />
        )}
      </SignedIn>

      {/* Phone Number Prompt Modal */}
      {showPhonePrompt && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 animate-fade-in">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <h2 className="text-xl font-bold mb-2 text-orange-600">Enter Your Phone Number</h2>
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <input
                className="w-full border p-2 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                type="tel"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                required
                minLength={8}
              />
              <button type="submit" className="btn-primary w-full">Continue</button>
            </form>
          </div>
        </div>
      )}

      {/* Order Confirmation Modal */}
      {order && (
        <OrderConfirmation orderItems={order} onClose={handleCloseOrder} />
      )}
    </div>
  );
}

export default App; 