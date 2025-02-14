// import React from 'react';
// import { Heart } from 'lucide-react';
// // import { Card, CardContent } from "@/components/ui/card";

// const Orders = () => {
//   // Sample data structure matching our database
//   const categories = [
//     {
//       id: 1,
//       name: "Bestseller Cakes Online",
//       description: "Delectably Delicious in Every Layer!",
//       products: [
//         {
//           id: 1,
//           name: "Chocolate Truffle Cake",
//           price: 595,
//           rating: 4.9,
//           reviewCount: 811,
//           imageUrl: "/api/placeholder/300/300",
//           earliestDelivery: "3 hours"
//         },
//         {
//           id: 2,
//           name: "Rosy Kiss Red Velvet Cake",
//           price: 795,
//           rating: 4.8,
//           reviewCount: 267,
//           imageUrl: "/api/placeholder/300/300",
//           earliestDelivery: "3 hours"
//         },
//         {
//           id: 3,
//           name: "Divine Butterscotch Cake",
//           price: 549,
//           rating: 4.6,
//           reviewCount: 175,
//           imageUrl: "/api/placeholder/300/300",
//           earliestDelivery: "3 hours"
//         },
//         {
//           id: 4,
//           name: "Teddy Love Cake",
//           price: 1395,
//           rating: 4.7,
//           reviewCount: 242,
//           imageUrl: "/api/placeholder/300/300",
//           earliestDelivery: "3 hours"
//         }
//       ]
//     },
//     {
//       id: 2,
//       name: "Valentine Cake",
//       description: "Special cakes for valentine's day",
//       products: [
//         {
//           id: 5,
//           name: "Rosy Kiss Red Velvet Cake",
//           price: 795,
//           rating: 4.8,
//           reviewCount: 267,
//           imageUrl: "/api/placeholder/300/300",
//           earliestDelivery: "3 hours"
//         },
//         // ... more products
//       ]
//     }
//   ];

//   const ProductCard = ({ product }) => (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden group relative">
//       <div className="relative">
//         <img 
//           src={product.imageUrl} 
//           alt={product.name}
//           className="w-full h-48 object-cover"
//         />
//         <button className="absolute top-2 right-2 p-1.5 bg-white rounded-full opacity-80 hover:opacity-100">
//           <Heart className="w-5 h-5 text-gray-600" />
//         </button>
//       </div>
//       <div className="p-4">
//         <h3 className="font-medium text-lg mb-1">{product.name}</h3>
//         <div className="text-xl font-semibold mb-2">₹ {product.price}</div>
//         <div className="flex items-center gap-2 mb-2">
//           <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-100 text-green-800">
//             <span className="text-sm">★ {product.rating}</span>
//           </span>
//           {product.reviewCount && (
//             <span className="text-sm text-gray-500">
//               ({product.reviewCount} Reviews)
//             </span>
//           )}
//         </div>
//         <div className="text-sm text-gray-500">
//           Earliest Delivery: In {product.earliestDelivery}
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8">
//       {categories.map((category) => (
//         <div key={category.id} className="mb-12">
//           <div className="flex justify-between items-center mb-6">
//             <div>
//               <h2 className="text-2xl font-bold mb-1">{category.name}</h2>
//               <p className="text-gray-600">{category.description}</p>
//             </div>
//             <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
//               View All
//             </button>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {category.products.map((product) => (
//               <ProductCard key={product.id} product={product} />
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };
// export default Orders;



import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Orders = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5000/orders/");
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const parseRes = await response.json();
      setCategories(parseRes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const ProductCard = ({ product }) => (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden group relative cursor-pointer"
      onClick={() => window.open(`/product/${product.id}`, '_blank')}
    >
      <div className="relative">
        <img 
          src={product.image_url || "/api/placeholder/300/300"} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <button className="absolute top-2 right-2 p-1.5 bg-white rounded-full opacity-80 hover:opacity-100">
          <Heart className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-lg mb-1">{product.name}</h3>
        <div className="text-xl font-semibold mb-2">₹ {product.price}</div>
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-100 text-green-800">
            <span className="text-sm">★ {product.rating}</span>
          </span>
          {product.review_count > 0 && (
            <span className="text-sm text-gray-500">
              ({product.review_count} Reviews)
            </span>
          )}
        </div>
        <div className="text-sm text-gray-500">
          Earliest Delivery: In 3 hours
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="bg-gray-200 h-64 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {categories.map((category) => (
        <div key={category.category_id} className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">{category.category_name}</h2>
              <p className="text-gray-600">{category.category_description}</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Link 
              to={`/category/${category.category_name}`}
              rel="noopener noreferrer"
            >
              View All
            </Link>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {category.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;