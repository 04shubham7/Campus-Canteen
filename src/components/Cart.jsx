import React from "react";

const Cart = ({ cartItems, onIncrement, onDecrement, onRemove, onPlaceOrder, onClose }) => {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="fixed top-0 right-0 w-full sm:w-96 h-full bg-white shadow-lg z-50 flex flex-col transition-transform duration-500 ease-in-out transform translate-x-0 animate-slide-in">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-bold">Your Cart</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800">✕</button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {cartItems.length === 0 ? (
          <p className="text-gray-500 text-center mt-8">Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between mb-4 border-b pb-2">
              <div>
                <h4 className="font-semibold">{item.name}</h4>
                <div className="text-sm text-gray-600">₹{item.price} x {item.quantity}</div>
                <div className="flex items-center mt-1">
                  <button onClick={() => onDecrement(item.id)} className="px-2 py-0.5 bg-gray-200 rounded-l">-</button>
                  <span className="px-3">{item.quantity}</span>
                  <button onClick={() => onIncrement(item.id)} className="px-2 py-0.5 bg-gray-200 rounded-r">+</button>
                  <button onClick={() => onRemove(item.id)} className="ml-3 text-red-500 hover:underline text-xs">Remove</button>
                </div>
              </div>
              <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded" />
            </div>
          ))
        )}
      </div>
      <div className="p-4 border-t">
        <div className="flex justify-between font-semibold mb-3">
          <span>Total:</span>
          <span>₹{total}</span>
        </div>
        <button
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition disabled:opacity-50"
          onClick={onPlaceOrder}
          disabled={cartItems.length === 0}
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Cart; 