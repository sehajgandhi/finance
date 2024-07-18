// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;


// config/db.js
const { Client } = require('pg');

const client = new Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});

client.connect()
  .then(() => console.log('PostgreSQL connected'))
  .catch(err => console.error('Connection error', err.stack));

const createTables = async () => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS stocks (
        id SERIAL PRIMARY KEY,
        symbol VARCHAR(10) NOT NULL,
        price DECIMAL NOT NULL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('Tables created successfully');
};

createTables();

module.exports = client;

