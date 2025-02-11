// import React from 'react';
// import { Link } from 'react-router-dom';
// import { 
//   Home, 
//   ShoppingCart, 
//   Package, 
//   ShoppingBasket, 
//   User, 
//   LogIn 
// } from 'lucide-react';

// const Navbar = ({ isAuthenticated, setAuth, userName }) => {
//   return (
//     <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo and Home Link */}
//           <div className="flex items-center">
//             <Link to="/" className="flex items-center">
//               <Home className="h-6 w-6 text-blue-600 mr-2" />
//               <span className="text-xl font-bold text-gray-800">MyApp</span>
//             </Link>
//           </div>

//           {/* Navigation Links */}
//           <div className="flex space-x-4">
//             <Link 
//               to="/orders" 
//               className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md flex items-center"
//             >
//               <Package className="h-5 w-5 mr-2" />
//               Orders
//             </Link>
//             <Link 
//               to="/hampers" 
//               className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md flex items-center"
//             >
//               <ShoppingBasket className="h-5 w-5 mr-2" />
//               Hampers
//             </Link>
//             <Link 
//               to="/cart" 
//               className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md flex items-center"
//             >
//               <ShoppingCart className="h-5 w-5 mr-2" />
//               Cart
//             </Link>
//           </div>

//           {/* Login/User Section */}
//           <div>
//             {isAuthenticated ? (
//               <div className="flex items-center space-x-4">
//                 <span className="text-gray-700">
//                   <User className="h-5 w-5 inline-block mr-2" />
//                   Hello, {userName || 'User'}
//                 </span>
//                 <button 
//                   onClick={(e) => {
//                     e.preventDefault();
//                     localStorage.removeItem("token");
//                     setAuth(false);
//                   }}
//                   className="text-red-600 hover:bg-red-50 px-3 py-2 rounded-md"
//                 >
//                   Logout
//                 </button>
//               </div>
//             ) : (
//               <Link 
//                 to="/login" 
//                 className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
//               >
//                 <LogIn className="h-5 w-5 mr-2" />
//                 Login / Sign Up
//               </Link>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  ShoppingCart, 
  User,
  LogIn,
  Grid 
} from 'lucide-react';

const Navbar = ({ isAuthenticated, setAuth, userName }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-blue-600 font-bold text-lg flex items-center">
            MyApp
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link 
              to="/orders" 
              className="flex items-center text-gray-600 hover:text-blue-600 transition"
            >
              <Package className="mr-1.5 h-5 w-5" />
              Orders
            </Link>
            <Link 
              to="/hampers" 
              className="flex items-center text-gray-600 hover:text-blue-600 transition"
            >
              <Grid className="mr-1.5 h-5 w-5" />
              Hampers
            </Link>
            <Link 
              to="/cart" 
              className="flex items-center text-gray-600 hover:text-blue-600 transition"
            >
              <ShoppingCart className="mr-1.5 h-5 w-5" />
              Cart
            </Link>
          </div>

          {/* Login/Signup Button */}
          {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 flex items-center">
                  <User className="h-5 w-5 mr-2 text-gray-500" />
                  Hello, {userName || 'User'}
                </span>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    localStorage.removeItem("token");
                    setAuth(false);
                  }}
                  className="text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-md text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
              >
                <LogIn className="h-5 w-5 mr-2" />
                Login / Sign Up
              </Link>
            )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;