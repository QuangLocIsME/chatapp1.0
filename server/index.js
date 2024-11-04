import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/connectDB.js';
// Import the router module
import AuthRouter from './router/index.js';
import ProfileRouter from './router/Profile.js';
import cookieParser from 'cookie-parser';
dotenv.config();

const app = express();
const port = process.env.PORT || 3030;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
// Connect to MongoDB
connectDB();

// API endpoints
app.use('/api/auth', AuthRouter);
app.use('/api/profile', ProfileRouter);

app.listen(port, () => console.log(`Server is running on port ${port}!`));
