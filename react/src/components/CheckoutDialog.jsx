import React, { useState } from 'react';

// Dialog Component (unchanged)
const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50 w-full max-w-md bg-white rounded-lg shadow-lg">
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const DialogHeader = ({ children }) => (
  <div className="mb-4">
    {children}
  </div>
);

const DialogTitle = ({ children }) => (
  <h2 className="text-lg font-semibold text-gray-900">
    {children}
  </h2>
);

const DialogFooter = ({ children }) => (
  <div className="mt-6 flex justify-end gap-3">
    {children}
  </div>
);

// Button Component (unchanged)
const Button = ({ children, className = "", ...props }) => (
  <button
    className={`px-4 py-2 rounded-md font-medium transition-colors
      ${className.includes('w-full') ? 'w-full' : ''}
      ${className.includes('bg-') ? className : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
    {...props}
  >
    {children}
  </button>
);

const CheckoutDialog = ({ isOpen, onClose, cart, onPaymentComplete }) => {
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [localCart, setLocalCart] = useState(null);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const handlePayment = async () => {
    // Validate form
    const errors = {};
    if (!phone.match(/^\+?[1-9]\d{1,14}$/)) {
      errors.phone = 'Valid phone number required';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
  
    try {
      setPaymentStatus('processing');
      setLocalCart(cart);
  
      const response = await fetch('http://localhost:5000/cart/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('token')
        },
        body: JSON.stringify({
          total: cart.total,
          phone: phone,
        })
      });
  
      if (!response.ok) throw new Error('Checkout failed');
  
      const data = await response.json();
      
      if (data.payment_status === 'completed') {
        setPaymentStatus('completed');
        onPaymentComplete();
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('pending');
      alert('Checkout failed: ' + error.message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {paymentStatus === 'completed' ? 'Order Placed!' : 'Complete Your Order'}
          </DialogTitle>
        </DialogHeader>
        
        {paymentStatus === 'pending' && (
          <div className="space-y-4">
            {/* Add contact information form */}
  <div className="space-y-3">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Contact Phone
      </label>
      <input
        type="tel"
        required
        className="w-full px-3 py-2 border rounded-md"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      {formErrors.phone && (
        <p className="text-red-500 text-sm">{formErrors.phone}</p>
      )}
    </div>
    
    
  </div>
            <div className="flex justify-center">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
                alt="Payment QR Code"
                className="border rounded-lg"
              />
            </div>
            
            <div className="border rounded-lg p-4 space-y-2">
              <h3 className="font-medium">Order Summary</h3>
              {cart.items.map(item => (
                <div key={item.cart_item_id} className="flex justify-between text-sm">
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹ {item.price_at_time * item.quantity}</span>
                </div>
              ))}
              <div className="border-t pt-2 font-medium flex justify-between">
                <span>Total Amount</span>
                <span>₹ {cart.total}</span>
              </div>
            </div>
          </div>
        )}
        
        {paymentStatus === 'processing' && (
          <div className="py-8 text-center">
            <p>Processing your payment...</p>
          </div>
        )}
        
        {paymentStatus === 'completed' && (
        <div className="space-y-4">
          <div className="text-center text-green-600">
            <p>Your order has been placed successfully!</p>
            <p className="text-sm text-gray-600 mt-2">
              Order ID: #{localCart?.order_id || 'N/A'}
            </p>
            <p className="text-sm mt-2">
              We'll contact you at {phone} for delivery updates
            </p>
          </div>
            
            <div className="border rounded-lg p-4 space-y-2">
              <h3 className="font-medium">Invoice</h3>
              {localCart?.items.map(item => (
                <div key={item.cart_item_id} className="flex justify-between text-sm">
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹ {item.price_at_time * item.quantity}</span>
                </div>
              ))}
              <div className="border-t pt-2 font-medium flex justify-between">
                <span>Total Paid</span>
                <span>₹ {localCart?.total}</span>
              </div>
            </div>
          </div>
        )}
        
        <DialogFooter>
          {paymentStatus === 'pending' && (
            <Button 
              onClick={handlePayment}
              className="w-full"
              disabled={cart.items.length === 0 || cart.total <= 0}
            >
              Pay ₹ {cart.total}
            </Button>
          )}
          {paymentStatus === 'completed' && (
            <Button 
              onClick={onClose}
              className="w-full"
            >
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutDialog;