const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const dotenv = require('dotenv');
const client = require('./config/db');

// Load environment variables
dotenv.config();

// Passport config
require('./config/passport')(passport);

// Express app setup
const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Use PostgreSQL to create tables
client.query(`
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS stocks (
        id SERIAL PRIMARY KEY,
        symbol VARCHAR(10) NOT NULL,
        price DECIMAL NOT NULL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`, (err, res) => {
    if (err) {
        console.error(err);
    } else {
        console.log('Tables created successfully');
    }
    client.end();
});


const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('A user connected');

    // Example: Emit real-time stock data to connected clients
    setInterval(async () => {
        const stocks = await Stock.find();
        socket.emit('stockData', stocks);
    }, 30000); // Emit data every 30 seconds

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/stocks', require('./routes/stocks'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
