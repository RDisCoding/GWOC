"use client"

import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { Search, Heart } from "lucide-react"

// Updated sample data with more details
const bestsellers = [
  {
    id: 'b1',
    name: "Chocolate Truffle Cake",
    price: 595,
    rating: 4.8,
    reviews: 811,
    image: "/public/ChocolateTuffle.png",
    deliveryTime: "3 hours",
    description: "Delectably Delicious in Every Layers!",
    weights: ['0.5 kg', '1 kg', '1.5 kg', '2 kg', '3 kg', '4 kg'],
    addons: [
      { name: "Basic", price: 595 },
      { name: "With Orchids", price: 1345 }
    ]
  },
  // Add other products with similar structure
  // ... add more bestsellers
  {
    id: 'b2',
    name: "Chocolate Truffle Cake",
    price: 595,
    rating: 4.8,
    reviews: 811,
    image: "/public/ChocolateTuffle.png",
    deliveryTime: "3 hours",
    description: "Delectably Delicious in Every Layers!",
    weights: ['0.5 kg', '1 kg', '1.5 kg', '2 kg', '3 kg', '4 kg'],
    addons: [
      { name: "Basic", price: 595 },
      { name: "With Orchids", price: 1345 }
    ]
  },
  {
    id: 'b3',
    name: "Truffle Cake",
    price: 595,
    rating: 4.8,
    reviews: 811,
    image: "/public/ChocolateTuffle.png",
    deliveryTime: "3 hours",
    description: "Delectably Delicious in Every Layers!",
    weights: ['0.5 kg', '1 kg', '1.5 kg', '2 kg', '3 kg', '4 kg'],
    addons: [
      { name: "Basic", price: 595 },
      { name: "With Orchids", price: 1345 }
    ]
  },
  {
    id: 'b4',
    name: "Chocolate ",
    price: 595,
    rating: 4.8,
    reviews: 811,
    image: "/public/ChocolateTuffle.png",
    deliveryTime: "3 hours",
    description: "Delectably Delicious in Every Layers!",
    weights: ['0.5 kg', '1 kg', '1.5 kg', '2 kg', '3 kg', '4 kg'],
    addons: [
      { name: "Basic", price: 595 },
      { name: "With Orchids", price: 1345 }
    ]
  },
]

const valentineItems = [
  {
    id: 'v1',
    name: "Love Hearts Cake",
    price: 895,
    rating: 4.9,
    reviews: 523,
    image: "/public/ChocolateTuffle.png",
    deliveryTime: "2 hours",
  },
  // ... add more valentine items
]

const expressItems = [
  {
    id: 'e1',
    name: "Quick Chocolate Delight",
    price: 495,
    rating: 4.7,
    reviews: 312,
    image: "/public/ChocolateTuffle.png",
    deliveryTime: "1 hour",
  },
  // ... add more express items
]

const flowers = [
  {
    id: 'f1',
    name: "Red Rose Bouquet",
    price: 799,
    rating: 4.6,
    reviews: 245,
    image: "/public/ChocolateTuffle.png",
    deliveryTime: "3 hours",
  },
  // ... add more flowers
]

// Add this at the top level, after your product arrays
const getAllProducts = () => [...bestsellers];

const ProductCard = ({ item }) => (
  <Link
    to={`/product/${item.id}`}
    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow max-w-[160px] mx-auto"
  >
    <div className="relative">
      <img 
        src={item.image} 
        alt={item.name} 
        className="w-full h-32 object-cover"
      />
      <button className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md">
        <Heart className="w-3 h-3 text-gray-400" />
      </button>
    </div>
    <div className="p-2">
      <h3 className="font-medium text-xs mb-1 truncate">{item.name}</h3>
      <div className="flex items-center gap-1 mb-1">
        <span className="px-1 py-0.5 bg-green-50 text-green-700 text-[10px] rounded">★ {item.rating}</span>
        <span className="text-[10px] text-gray-500">({item.reviews})</span>
      </div>
      <p className="font-semibold text-xs mb-1">₹{item.price}</p>
      <p className="text-[10px] text-gray-500">Delivery in {item.deliveryTime}</p>
    </div>
  </Link>
)

const Section = ({ id, title, items, description }) => (
  <div id={id} className="mb-16">
    <div className="flex justify-between items-center mb-4">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        {description && <p className="text-gray-600 text-sm mt-1">{description}</p>}
      </div>
      <Link to={`/all-${id}`} className="px-3 py-1.5 text-xs text-white bg-teal-700 rounded-md">
        View All
      </Link>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <ProductCard key={item.id} item={item} />
      ))}
    </div>
  </div>
)

const OrdersPage = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef(null)

  const handleSearch = (query) => {
    setSearchQuery(query)
    if (query.trim() === '') {
      setSuggestions([])
      return
    }

    const allProducts = getAllProducts()
    const searchResults = allProducts.filter(item => {
      const matchName = item.name.toLowerCase().includes(query.toLowerCase())
      const matchCategory = item.category.toLowerCase().includes(query.toLowerCase())
      return matchName || matchCategory
    })

    setSuggestions(searchResults.slice(0, 10)) // Increased to 10 suggestions
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Enhanced Search Bar */}
      <div ref={searchRef} className="relative w-1/2 mx-auto my-6">
        <input          type="text"
          placeholder="Search for products or categories..."
          className="w-full px-4 py-2 border rounded-lg bg-gray-50"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
        />
        <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />

        {/* Search Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-0"></div>
            <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-80 overflow-y-auto">
              {suggestions.map((item) => (
                <Link
                  key={item.id}
                  to={`/product/${item.id}`}
                  className="flex items-center px-4 py-2 hover:bg-gray-50 border-b last:border-b-0"
                  onClick={() => setShowSuggestions(false)}
                >
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">{item.name}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      <span className="capitalize">{item.category}</span>
                      <span>•</span>
                      <span>₹{item.price}</span>
                      <span>•</span>
                      <span className="flex items-center">
                        ★ {item.rating} ({item.reviews})
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Category Navigation */}
      <div className="flex justify-between items-center py-3 space-x-8 border-b mb-8">
        {['bestsellers','valentines', 'express', 'flowers'].map((category) => (
          <a
            key={category}
            href={`#${category}`}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection(category);
            }}
            className="whitespace-nowrap text-gray-600 hover:text-pink-600 font-medium cursor-pointer"
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </a>
        ))}
      </div>

      {/* Sections */}
      <div className="space-y-12">
        <Section 
          id="bestsellers" 
          title="Bestseller Cakes Online" 
          description="Delectably Delicious in Every Layers!"
          items={bestsellers} 
        />
        <Section 
          id="valentines" 
          title="Valentine's Day Special" 
          description="Delectably Delicious in Every Layers!"
          items={valentineItems} 
        />
        <Section 
          id="express" 
          title="Express Delivery" 
          description="Delectably Delicious in Every Layers!"
          items={expressItems} 
        />
        <Section 
          id="flowers" 
          title="Fresh Flowers" 
          description="Delectably Delicious in Every Layers!"
          items={flowers} 
        />
        {/* Add other sections */}
      </div>
    </div>
  )
}

export default OrdersPage