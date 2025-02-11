const express = require('express');
const app = express();
const cors = require('cors');  

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

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
