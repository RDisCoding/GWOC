import pg from "pg";
import express from "express";
import bodyParser from "body-parser";

const { Client } = pg;

const client = new Client({
  host: 'localhost',
  user: 'postgres',
  password: 'postgres',
  database: 'gwoc',
  port: 5432,
});
client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Connection error', err.stack));

// Create the users table:
// const createTable = async () => {
//   await client.query(`CREATE TABLE IF NOT EXISTS users 
//     (id serial PRIMARY KEY, name VARCHAR (255) UNIQUE NOT NULL, 
//     email VARCHAR (255) UNIQUE NOT NULL, age INT NOT NULL);`);
// };

// createTable();

// Use Express and the middleware to parse the POST method:
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add a Hello World route:
app.get("/api", (req, res) => res.send("Hello World!"));

// Create a GET method to retrieve all users from the users table:
app.get("/api/all", async (req, res) => {
  try {
    const response = await client.query(`SELECT * FROM demo`);

    if (response) {
      res.status(200).send(response.rows);
    }
  } catch (error) {
    res.status(500).send("Error");
    console.log(error);
  }
});

// // Create a POST method to insert users into the users table:
// app.post("/api/form", async (req, res) => {
//   try {
//     const name = req.body.name;
//     const email = req.body.email;
//     const age = req.body.age;

//     const response = await client.query(
//       `INSERT INTO users(name, email, age) VALUES ('${name}', '${email}', ${age});`
//     );
//     if (response) {
//       res.status(200).send(req.body);
//     }
//   } catch (error) {
//     res.status(500).send("Error");
//     console.log(error);
//   }
// });

//Finally, add a port that will expose the API when the server is running. Here, we expose it on port 3000.
app.listen(3000, () => console.log(`App running on port 3000.`));

// This code is a complete Express.js API server that:

// Sets up a web server using Express
// Creates API endpoints (/api, /api/all, /api/form)
// Maintains an ongoing database connection for handling requests
// Uses middleware (body-parser) to handle POST requests
// Creates a users table and provides endpoints to interact with it