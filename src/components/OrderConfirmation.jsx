import React from "react";

const OrderConfirmation = ({ orderItems, onClose }) => {
  const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <svg className="w-14 h-14 text-green-500 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2 text-green-600">Thank you for your order!</h2>
        <p className="mb-4 text-gray-700">Your food will be ready soon. Here is your order summary:</p>
        <ul className="mb-4 text-left">
          {orderItems.map((item) => (
            <li key={item.id} className="flex justify-between mb-1">
              <span>{item.name} x {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </li>
          ))}
        </ul>
        <div className="font-semibold mb-4">Total: ₹{total}</div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation; 