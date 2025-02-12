// components/ReviewDialog.jsx
import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Button } from './ui/Dialog';

const ReviewDialog = ({ isOpen, onClose }) => {
  const [pendingReviews, setPendingReviews] = useState([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchPendingReviews();
    }
  }, [isOpen]);

  const fetchPendingReviews = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        onClose();
        return [];
      }
  
      const response = await fetch('http://localhost:5000/api/reviews/pending', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.reload();
        return [];
      }
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      setPendingReviews(data);
      return data;
    } catch (error) {
      console.error('Error fetching pending reviews:', error);
      onClose();
      return [];
    }
  };

  const handleSubmitReview = async () => {
    if (!rating) return;
    
    const currentReview = pendingReviews[currentReviewIndex];
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          product_id: currentReview.product_id,
          order_id: currentReview.order_id,
          rating,
          comment
        })
        
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.reload();
        return;
      }
  
      // Check for server errors
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit review');
      }
  
      // Refresh pending reviews list
      const updatedReviews = await fetchPendingReviews();
      
      if (updatedReviews.length > 0) {
        setCurrentReviewIndex(0);  // Reset to first item with new data
        setRating(0);
        setComment('');
      } else {
        onClose();  // Close dialog if no more reviews
      }
    } catch (error) {
      console.error('Error submitting review:', error.message);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    const currentReview = pendingReviews[currentReviewIndex];
    
    try {
      const response = await fetch(`http://localhost:5000/api/reviews/skip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          product_id: currentReview.product_id,
          order_id: currentReview.order_id
        })
      });
  
      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.reload();
        return;
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to skip review');
      }
  
      // Refresh pending reviews list
      const updatedReviews = await fetchPendingReviews();
      
      if (updatedReviews.length > 0) {
        setCurrentReviewIndex(0);
        setRating(0);
        setComment('');
      } else {
        onClose();
      }
    } catch (error) {
      console.error('Error skipping review:', error.message);
      alert('Failed to skip review. Please try again.');
    }
  };

  if (!pendingReviews.length) return null;

  const currentReview = pendingReviews[currentReviewIndex];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review Your Purchase</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="font-medium text-lg">{currentReview?.product_name}</h3>
            <p className="text-sm text-gray-600">How would you rate this product?</p>
          </div>

          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="text-2xl focus:outline-none"
              >
                <Star
                  className={`w-8 h-8 ${
                    rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>

          <textarea
            placeholder="Share your thoughts about this product (optional)"
            className="w-full p-3 border rounded-md"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />
        </div>

        <DialogFooter>
          <div className="flex w-full gap-3">
            <Button
              onClick={handleSkip}
              className="bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Maybe Later
            </Button>
            <Button
              onClick={handleSubmitReview}
              disabled={!rating || isSubmitting}
              className="flex-1"
            >
              Submit Review
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog;