// app.js
import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import RewardDistributionRouter from './routes/adminRoutes.js';
import walletRoutes from './routes/walletRoutes.js';
import emailRoutes from './routes/emailRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/v1/rewards', RewardDistributionRouter);
app.use('/api/wallet', walletRoutes);
app.use('/api/email', emailRoutes);
app.use('/api', contactRoutes);

// Export app
export default app;
