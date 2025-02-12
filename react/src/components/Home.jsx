// Modified Home.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReviewDialog from './ReviewDialog';

const Home = () => {
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

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Our Platform</h1>
        <p className="text-xl text-black">Explore our amazing products and services</p>
      </div>

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