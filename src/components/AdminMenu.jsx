import React, { useState } from "react";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  image: ""
};

const AdminMenu = ({ menu, setMenu, orderHistory }) => {
  const [activeTab, setActiveTab] = useState("orders"); // 'orders' or 'menu'
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return;
    if (editId) {
      setMenu((prev) =>
        prev.map((item) =>
          item.id === editId ? { ...item, ...form, price: Number(form.price) } : item
        )
      );
    } else {
      setMenu((prev) => [
        ...prev,
        {
          ...form,
          id: Date.now(),
          price: Number(form.price)
        }
      ]);
    }
    setForm(emptyForm);
    setEditId(null);
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image || ""
    });
    setEditId(item.id);
  };

  const handleDelete = (id) => {
    setMenu((prev) => prev.filter((item) => item.id !== id));
    if (editId === id) {
      setForm(emptyForm);
      setEditId(null);
    }
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditId(null);
  };

  // Calculate order statistics
  const totalOrders = orderHistory.length;
  const totalRevenue = orderHistory.reduce((sum, order) => 
    sum + order.items.reduce((orderSum, item) => orderSum + (item.price * item.quantity), 0), 0
  );
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <div className="space-y-6">
      {/* Admin Dashboard Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-orange-700">Total Orders</h3>
            <p className="text-3xl font-bold text-orange-600">{totalOrders}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-700">Total Revenue</h3>
            <p className="text-3xl font-bold text-green-600">₹{totalRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-700">Average Order Value</h3>
            <p className="text-3xl font-bold text-blue-600">₹{averageOrderValue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 border-b">
        <button
          className={`px-4 py-2 font-semibold ${
            activeTab === "orders"
              ? "text-orange-600 border-b-2 border-orange-600"
              : "text-gray-600 hover:text-orange-600"
          }`}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </button>
        <button
          className={`px-4 py-2 font-semibold ${
            activeTab === "menu"
              ? "text-orange-600 border-b-2 border-orange-600"
              : "text-gray-600 hover:text-orange-600"
          }`}
          onClick={() => setActiveTab("menu")}
        >
          Menu Management
        </button>
      </div>

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Recent Orders</h3>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orderHistory.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        #{order.id.toString().slice(-6)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.date).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.userEmail}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.phoneNumber || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {order.items.map(item => `${item.name} (${item.quantity})`).join(", ")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₹{order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Menu Management Tab */}
      {activeTab === "menu" && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Add/Edit Menu Item</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    name="name"
                    placeholder="Item name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    name="price"
                    type="number"
                    placeholder="Price"
                    value={form.price}
                    onChange={handleChange}
                    required
                    min="1"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  name="image"
                  placeholder="Image URL (optional)"
                  value={form.image}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  name="description"
                  placeholder="Item description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary">
                  {editId ? "Update Item" : "Add Item"}
                </button>
                {editId && (
                  <button type="button" onClick={handleCancel} className="btn-secondary">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Current Menu Items</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {menu.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow p-4 flex flex-col">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-32 object-cover rounded mb-2" 
                    onError={e => e.target.style.display='none'} 
                  />
                  <h3 className="font-semibold">{item.name}</h3>
                  <div className="text-gray-600 text-sm mb-1">₹{item.price}</div>
                  <div className="text-xs text-gray-500 mb-2">{item.description}</div>
                  <div className="flex gap-2 mt-auto">
                    <button onClick={() => handleEdit(item)} className="btn-secondary">Edit</button>
                    <button 
                      onClick={() => handleDelete(item.id)} 
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMenu; 