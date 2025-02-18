const express = require('express');
const app = express();
const cors = require('cors');  
const pool = require('./db'); // Your database connection
const auth = require('./middleware/authorization');
const Razorpay = require('razorpay');

// Middleware
app.use(express.json()); 
app.use(express.urlencoded({extended: false}));
app.use(cors());

// routes
// register and login routes
app.use('/auth', require('./routes/jwtAuth'));
app.use("/dashboard", require("./routes/dashboard")); 
// app.use("/categories", require("./routes/categories"));
app.use("/orders", require("./routes/orders"));
app.use("/products", require("./routes/products"));
app.use("/cart", require("./routes/cart"));
app.use('/admin', require('./routes/admin'));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/hampers", require("./routes/hampers"));
app.use('/track', require('./routes/orderTracking'));

// Modify your order endpoint like this
app.post("/order", async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Create proper order options
    const options = {
      amount: req.body.amount, // This should be in paise
      currency: req.body.currency,
      receipt: req.body.receipt,
      payment_capture: 1    // Auto capture payment
    };

    console.log("Creating order with options:", options);

    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).send("Error creating order");
    }

    console.log("Order created:", order);
    res.json(order);
  } catch (error) {
    console.error("Detailed error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});