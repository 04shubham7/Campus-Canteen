import React from "react";

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString();
}

const OrderHistory = ({ orderHistory }) => {
  if (!orderHistory.length) {
    return (
      <div className="text-center py-12">
        <div className="bg-white rounded-lg shadow p-8 max-w-md mx-auto">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Yet</h3>
          <p className="text-gray-500">
            Your order history will appear here once you place an order.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Order History</h2>
      <div className="space-y-6">
        {orderHistory.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Order #{order.id.toString().slice(-6)}</div>
                <div className="text-sm text-gray-500">{formatDate(order.date)}</div>
              </div>
              <div className="text-lg font-semibold text-green-600">
                ₹{order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)}
              </div>
            </div>
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-700 mb-2">Items:</h4>
              <ul className="space-y-2">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="text-gray-800">
                      ₹{item.price * item.quantity}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory; 