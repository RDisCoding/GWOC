// // PaymentHandler.js
// import axios from 'axios';

// export const handlePaymentSuccess = async () => {
//   try {
//     // Get stored cart data
//     const pendingCartData = JSON.parse(localStorage.getItem('pendingCartData'));
//     if (!pendingCartData) {
//       throw new Error('No pending cart data found');
//     }

//     // Place the order
//     const response = await fetch('http://localhost:5000/cart/checkout', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'token': localStorage.getItem('token')
//       },
//       body: JSON.stringify({
//         total: pendingCartData.total,
//         phone: pendingCartData.phone,
//         cart_items: pendingCartData.cart.items,
//         hampers: pendingCartData.hampers,
//         payment_mode: 'online'
//       })
//     });

//     if (!response.ok) {
//       throw new Error('Failed to place order');
//     }

//     // Clear pending cart data
//     localStorage.removeItem('pendingCartData');
    
//     return true;
//   } catch (error) {
//     console.error('Error handling payment success:', error);
//     return false;
//   }
// };

import axios from "axios";

export const handlePaymentSuccess = async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const transactionId = urlParams.get('transactionId');
    
    console.log('Processing success for transaction:', transactionId);
    
    if (!transactionId) {
      throw new Error('No transaction ID found in URL');
    }

    console.log('Verifying payment...');
    const verifyResponse = await axios.get(
      `http://localhost:5000/verify-payment/${transactionId}`
    );

    console.log('Verification response:', verifyResponse.data);

    if (!verifyResponse.data.success) {
      throw new Error(`Payment verification failed: ${verifyResponse.data.message || 'Unknown error'}`);
    }

    // Attempt to get cart data but proceed even if missing
    const pendingCartDataString = localStorage.getItem(`pendingCartData_${transactionId}`);
    let orderData = {
      transaction_id: transactionId,
      payment_mode: 'online'
    };

    if (pendingCartDataString) {
      const pendingCartData = JSON.parse(pendingCartDataString);
      orderData = {
        ...orderData,
        total: pendingCartData.total,
        phone: pendingCartData.phone,
        cart_items: pendingCartData.cart.items,
        hampers: pendingCartData.hampers
      };
    }

    console.log('Placing order with data:', orderData);

    const response = await fetch('http://localhost:5000/cart/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': localStorage.getItem('token')
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to place order: ${errorData.error || 'Unknown error'}`);
    }

    const orderResult = await response.json();
    console.log('Order placed successfully:', orderResult);

    localStorage.removeItem(`pendingCartData_${transactionId}`);
    return true;
  } catch (error) {
    console.error('Payment success handling failed:', {
      error: error.message,
      stack: error.stack
    });
    return false;
  }
};