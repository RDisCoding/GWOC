import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Info } from 'lucide-react';
import SimilarProducts from './SimilarProducts';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState('0.5');
  const [selectedVariant, setSelectedVariant] = useState('basic');
  const [nameOnCake, setNameOnCake] = useState('');

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/products/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product details');
      }
      const parseRes = await response.json();
      
      // Set initial selected weight to first available weight
      if (parseRes.available_weights && parseRes.available_weights.length > 0) {
        setSelectedWeight(parseRes.available_weights[0].value);
      }
      
      setProduct(parseRes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    try {
      const response = await fetch('http://localhost:5000/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: product.product_id,
          quantity: 1,
          price: variants.find(v => v.id === selectedVariant)?.price,
          customizations: {
            weight: selectedWeight,
            variant: selectedVariant,
            nameOnCake: nameOnCake || null
          }
        }),
        credentials: 'include' // to include cookies for authentication
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      // Show success message or update cart counter
      alert('Product added to cart successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to add product to cart');
    }
  };

  const handleBuyNow = async () => {
    await addToCart();
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-200 rounded-lg h-96"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const variants = [
    { id: 'basic', name: 'Basic', price: product.price },
    { id: 'orchids', name: 'With Orchids', price: product.price + 750 }
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left Column - Images */}
      <div className="space-y-4">
        <div className="relative">
          <img 
            src={product.image_url || "/api/placeholder/400/400"} 
            alt={product.name}
            className="w-full rounded-lg"
          />
          <button className="absolute top-4 right-4 p-1.5 bg-white rounded-full opacity-80 hover:opacity-100">
            <Heart className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Right Column - Product Details */}
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {product.is_eggless && (
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">EGGLESS</span>
            )}
          </div>
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <div className="flex items-center gap-2">
            <span className="bg-green-500 text-white px-2 py-1 rounded text-sm">★ {product.rating}</span>
            <span className="text-gray-600">{product.review_count} Reviews</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-2xl font-bold">
            ₹ {variants.find(v => v.id === selectedVariant)?.price}
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Make this gift extra special</h3>
            <div className="grid grid-cols-2 gap-4">
              {variants.map((variant) => (
                <div 
                  key={variant.id}
                  className={`p-4 border rounded-lg cursor-pointer ${
                    selectedVariant === variant.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedVariant(variant.id)}
                >
                  <img 
                    src={product.image_url || "/api/placeholder/200/200"} 
                    alt={variant.name} 
                    className="w-full h-24 object-cover rounded mb-2" 
                  />
                  <div className="text-sm">{variant.name}</div>
                  <div className="font-semibold">₹ {variant.price}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
          <h3 className="font-medium mb-2">Weight</h3>
          <div className="flex flex-wrap gap-2">
            {product.available_weights?.map((weight) => (
              <button
                key={weight.value}
                className={`px-4 py-2 rounded border ${
                  selectedWeight === weight.value 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200'
                }`}
                onClick={() => setSelectedWeight(weight.value)}
              >
                {weight.label}
              </button>
            ))}
          </div>
        </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <h3 className="font-medium">Name on Cake</h3>
              <span className="text-sm text-gray-500">{nameOnCake.length} / 25</span>
            </div>
            <input
              type="text"
              value={nameOnCake}
              onChange={(e) => setNameOnCake(e.target.value)}
              placeholder="Write Name Here"
              className="w-full px-4 py-2 border rounded"
              maxLength={25}
            />
          </div>

          <div className="border rounded-lg p-4 bg-blue-50">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              <span className="font-medium">Offers Available</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Product Contains</h3>
            <ul className="space-y-1 text-gray-600">
              <li>• Flavor: {product.name}</li>
              <li>• Shape: {product.shape || 'Round'}</li>
              <li>• Type: {product.type || 'Cream'}</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Description</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>

          <div className="pt-4 flex gap-4">
          <button 
            onClick={addToCart}
            className="flex-1 px-6 py-3 border border-blue-500 text-blue-500 rounded-lg font-medium">
            ADD TO CART
          </button>
          <button 
            onClick={handleBuyNow}
            className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg font-medium">
            BUY NOW | ₹ {variants.find(v => v.id === selectedVariant)?.price}
          </button>
        </div>
        </div>
      </div>

      <SimilarProducts currentProductId={product.product_id} />
    </div>
  );
};

export default ProductDetails;