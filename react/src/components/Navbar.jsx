import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User } from 'lucide-react';

const Navbar = ({ cartCount, setIsLoginOpen }) => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-pink-600">
            Cake Shop
          </Link>
          
          <div className="flex items-center space-x-8">
            <Link to="/orders" className="text-gray-700 hover:text-pink-600">
              Order Cakes
            </Link>
            <Link to="/hampers" className="text-gray-700 hover:text-pink-600">
              Hampers
            </Link>
            <button
              onClick={() => setIsLoginOpen(true)}
              className="flex items-center text-gray-700 hover:text-pink-600"
            >
              <User className="w-5 h-5 mr-1" />
              Login
            </button>
            <Link to="/cart" className="relative">
              <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-pink-600" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;