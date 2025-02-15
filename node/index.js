
// import pg from "pg";
// import express from "express";
// import bodyParser from "body-parser";
// import dotenv from "dotenv";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import cors from "cors";
// import { authenticate } from "./authMiddleware.js";

// dotenv.config();

// const { Client } = pg;

// const client = new Client({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT,
// });

// client.connect()
//   .then(() => console.log('Connected to PostgreSQL'))
//   .catch(err => console.error('Connection error', err.stack));

// // Use Express and the middleware to parse the POST method:
// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.get("/api", (req, res) => res.send("Hello World!"));

// //Finally, add a port that will expose the API when the server is running. Here, we expose it on port 3000.
// app.listen(3000, () => console.log(`App running on port 3000.`));

// // This code is a complete Express.js API server that:

// // Sets up a web server using Express
// // Creates API endpoints (/api, /api/all, /api/form)
// // Maintains an ongoing database connection for handling requests
// // Uses middleware (body-parser) to handle POST requests
// // Creates a users table and provides endpoints to interact with it

import pg from "pg";
import express from "express";
import bodyParser from "body-parser";
import twilio from "twilio";
import 'dotenv/config';


const { Client } = pg;
const app = express();
const TwilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Database connection
const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

client.connect()
  .then(() => {
    console.log('Connected to PostgreSQL');
    // Create orders table if not exists
    client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        cake_type VARCHAR(255) NOT NULL,
        quantity INT NOT NULL,
        order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  })
  .catch(err => console.error('Connection error', err.stack));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get('/', (req, res) => {
  res.send('Welcome to the Cake Order API');
});

// Order endpoint
app.post("/api/order", async (req, res) => {
  try {
    const { name, phone, cakeType, quantity } = req.body;
    
    // Save to database
    const result = await client.query(
      `INSERT INTO orders (customer_name, phone, cake_type, quantity)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, phone, cakeType, quantity]
    );

    // Send WhatsApp message
    const message = `Hi ${name}! 🎂\nYour order for ${quantity} ${cakeType} cake(s) is confirmed.\nOrder ID: ${result.rows[0].id}\nThank you!`;
    
    await TwilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to: `whatsapp:${phone}`
    });

    res.status(200).json({ success: true, order: result.rows[0] });
  } catch (error) {
    console.error('Full Error:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Duplicate order' });
    }
    res.status(500).json({ 
      error: 'Order failed',
      details: error.message 
    });
  }
});

app.listen(3000, () => console.log(`App running on port 3000`));

