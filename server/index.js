import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/connectDB.js';
import AuthRouter from './router/index.js'; // Import the router module

dotenv.config();

const app = express();
const port = process.env.PORT || 3030;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(express.json());

// Connect to MongoDB
connectDB();

// API endpoints
app.use('/api/auth', AuthRouter);

app.listen(port, () => console.log(`Server is running on port ${port}!`));