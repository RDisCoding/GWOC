const express = require('express');
const app = express();
const cors = require('cors');  
const pool = require('./db'); // Your database connection
const auth = require('./middleware/authorization');

// Middleware
app.use(express.json()); //req.body
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


app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
