import express from 'express';
import cors from 'cors';
import { initializeDatabase } from '../src/config/db.js';
import authRoutes from '../src/routes/auth.js';

// Initialize the database connection (only once ideally, but Vercel manages this per cold start)
initializeDatabase();

const app = express();

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend API is running on Vercel.' });
});

export default app;
