// app.js
import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import locationRoutes from './routes/loactionRoute.js'; 
import garbageRoutes from './routes/garbageRoute.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/location/', locationRoutes);
app.use('/api/garbage', garbageRoutes); 

// Export app
export default app;
