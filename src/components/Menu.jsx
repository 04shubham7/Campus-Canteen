import React from "react";

const Menu = ({ menuItems, onAddToCart }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
      {menuItems.map((item) => (
        <div
          key={item.id}
          className="card flex flex-col items-center group cursor-pointer transition-transform duration-300"
        >
          <div className="overflow-hidden rounded mb-2 w-32 h-32 flex items-center justify-center">
            <img
              src={item.image}
              alt={item.name}
              className="w-32 h-32 object-cover rounded transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
          <p className="text-gray-600 text-sm mb-2 text-center">{item.description}</p>
          <div className="flex items-center justify-between w-full mt-auto">
            <span className="font-bold text-green-600">₹{item.price}</span>
            <button
              className="ml-2 btn-primary active:scale-95 focus:outline-none"
              onClick={() => onAddToCart(item)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Menu; 