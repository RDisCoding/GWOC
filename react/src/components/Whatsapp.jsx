import React, { useState } from 'react';
import axios from 'axios';

const WhatsappOrder = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    cakeType: 'Chocolate',
    quantity: 1
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/order', formData);
      if (response.data.success) {
        alert('Order placed successfully! WhatsApp confirmation sent.');
      }
    } catch (error) {
      console.error('Order failed:', error);
      alert('Failed to place order. Please try again.');
    }
  };
  

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Place Cake Order</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Phone (with country code):</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => {
              const value = e.target.value.startsWith('+') 
                ? e.target.value 
                : `+91${e.target.value}`;
              setFormData({ ...formData, phone: value });
            }}
            className="w-full p-2 border rounded"
            placeholder="+919876543210"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Cake Type:</label>
          <select
            value={formData.cakeType}
            onChange={(e) => setFormData({ ...formData, cakeType: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="Chocolate">Chocolate</option>
            <option value="Vanilla">Vanilla</option>
            <option value="Red Velvet">Red Velvet</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Quantity:</label>
          <input
            type="number"
            min="1"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Place Order & Send WhatsApp
        </button>
      </form>
    </div>
  );
};

export default WhatsappOrder;