import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReviewDialog from './ReviewDialog';
import HeroCarousel from "./HeroCarousel";
import CategoryNav from "./CategoryNav";
import ProductSection from "./ProductSection";
import AboutUs from "./AboutUs";
import Reviews from "./Reviews";

const Home = () => {
  // State from original Home.jsx
  const [pendingReview, setPendingReview] = useState(null);
  const [showThankYou, setShowThankYou] = useState(false);

  useEffect(() => {
    checkPendingReviews();
  }, []);

  const checkPendingReviews = async () => {
    try {
      const response = await axios.get('/api/orders/pending-reviews');
      if (response.data.length > 0) {
        setPendingReview(response.data[0]);
      }
    } catch (error) {
      console.error('Error checking pending reviews:', error);
    }
  };

  const handleReviewSubmit = () => {
    setPendingReview(null);
    setShowThankYou(true);
    setTimeout(() => setShowThankYou(false), 3000);
  };

  const handleNavAction = async (action) => {
    switch(action) {
      case 'checkReviews':
        await checkPendingReviews();
        break;
      case 'closeReview':
        setPendingReview(null);
        break;
      // Add more actions as needed
      default:
        break;
    }
  };

  // Product data from Ignore.jsx
  const bestsellers = [
    {
      id: 1,
      name: "Classic Vanilla Cupcake",
      image: "https://sugargeekshow.com/wp-content/uploads/2022/08/vanilla_cupcake_featured_blog.jpg",
      price: "$3.99",
    },
    {
      id: 2,
      name: "Classic Vanilla Cupcake",
      image: "/placeholder.svg",
      price: "$3.99",
    },
    {
      id: 3,
      name: "Classic Vanilla Cupcake",
      image: "/placeholder.svg",
      price: "$3.99",
    },
    {
      id: 4,
      name: "Classic Vanilla Cupcake",
      image: "/placeholder.svg",
      price: "$3.99",
    },
    {
      id: 5,
      name: "Classic Vanilla Cupcake",
      image: "/placeholder.svg",
      price: "$3.99",
    }
  ];

  const newAdditions = [
    {
      id: 1,
      name: "Rainbow Cake",
      image: "/placeholder.svg",
      price: "$24.99",
    },
    {
      id: 2,
      name: "Classic Vanilla Cupcake",
      image: "https://sugargeekshow.com/wp-content/uploads/2022/08/vanilla_cupcake_featured_blog.jpg",
      price: "$3.99",
    },
    {
      id: 3,
      name: "Classic Vanilla Cupcake",
      image: "/placeholder.svg",
      price: "$3.99",
    },
    {
      id: 4,
      name: "Classic Vanilla Cupcake",
      image: "/placeholder.svg",
      price: "$3.99",
    },
    {
      id: 5,
      name: "Classic Vanilla Cupcake",
      image: "/placeholder.svg",
      price: "$3.99",
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      
      <main className="flex-grow">
        <HeroCarousel />
        
        <div className="relative z-10">
          <CategoryNav />
        </div>

        <div className="relative z-20 -mt-8">
          <ProductSection title="Our Bestsellers" products={bestsellers} />
        </div>

        <div className="relative z-20 -mt-8">
          <ProductSection title="New Additions" products={newAdditions} />
        </div>

        <div className="relative z-20 -mt-8">
          <AboutUs />
        </div>

        <div className="relative z-20 -mt-8">
          <Reviews />
        </div>
      </main>

      {pendingReview && (
        <ReviewDialog
          order={pendingReview}
          onClose={() => setPendingReview(null)}
          onSubmit={handleReviewSubmit}
        />
      )}

      {showThankYou && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
          Thank you for your review!
        </div>
      )}
    </div>
  );
};

export default Home;