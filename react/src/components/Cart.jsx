import React from 'react';
import { Trash2 } from 'lucide-react';

const Cart = () => {
  // Sample data structure matching the simplified DB schema
  const cart = {
    items: [
      {
        id: 1,
        name: 'Rasmalai Pista Cream Cake',
        price: 895,
        weight: '0.5 Kg',
        quantity: 1
      },
      {
        id: 2,
        name: 'Two Hersheys Milk Chocolates Each 33 gm',
        price: 299,
        quantity: 1
      },
      {
        id: 3,
        name: 'Make Your Own Valentine Hamper',
        price: 1661,
        quantity: 1,
        contents: [
          'Bournville Cranberry Bar 80Gm x 1',
          'Heart Panda Teddy x 1',
          'Red Big Heart Teddy x 1',
          'Red Artificial Rose x 1',
          'Engage Femme Perfume 90Ml x 1',
          'Floweraura Boxes x 1',
          'Love Fortune Greeting Card x 1'
        ]
      }
    ],
    total: 2855
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Cart</h2>
            
            {cart.items.map(item => (
              <div key={item.id} className="flex items-start gap-4 py-4 border-t">
                <img 
                  src="/api/placeholder/80/80"
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      {item.weight && (
                        <p className="text-sm text-gray-500">Weight: {item.weight}</p>
                      )}
                      {item.contents && (
                        <ul className="mt-2 text-sm text-gray-500">
                          {item.contents.map((content, idx) => (
                            <li key={idx}>• {content}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="font-medium">₹ {item.price}</p>
                    <div className="flex items-center gap-2">
                      <button className="w-8 h-8 flex items-center justify-center border rounded-md">-</button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button className="w-8 h-8 flex items-center justify-center border rounded-md">+</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add-ons Section */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Your last minute add-ons</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Magic Candles', price: 59 },
                { name: 'Birthday Card', price: 129 },
                { name: '1 Kg Rasgulla', price: 549 },
                { name: 'Small Pink Teddy Bear (6")', price: 299 }
              ].map((item, idx) => (
                <div key={idx} className="text-center">
                  <img 
                    src="/api/placeholder/160/160"
                    alt={item.name}
                    className="w-full aspect-square object-cover rounded-lg mb-2"
                  />
                  <h3 className="text-sm font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-600">₹ {item.price}</p>
                  <button className="mt-2 w-full py-2 text-sm text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50">
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bill Summary Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="border-b pb-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Bill Summary</h2>
                <span className="text-gray-600">{cart.items.length} Items</span>
              </div>
            </div>
            <div className="pt-4 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Item Total</span>
                <span className="font-medium">₹ {cart.total}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Grand Total</span>
                <span>₹ {cart.total}</span>
              </div>
              <button className="w-full py-3 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors">
                PLACE ORDER
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;