// app.js
import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';
const app = express();
import RewardDistributionRouter from './routes/adminRoutes.js';
import walletRoutes from './routes/walletRoutes.js';
import emailRoutes from './routes/emailRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js'
dotenv.config({ path: './.env' });
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  
// Middleware
app.use(cors({
    origin: "http://localhost:5173", // your frontend's origin
    credentials: true,               // allow cookies to be sent
  }));
  app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/v1/rewards', RewardDistributionRouter);
app.use('/api/wallet', walletRoutes);
app.use('/api/email', emailRoutes);
app.use('/api', contactRoutes);
app.use('/api/transactions', transactionRoutes);

// Export app
export default app;
