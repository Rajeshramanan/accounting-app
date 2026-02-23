import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeDatabase } from './src/config/db.js';
import authRoutes from './src/routes/auth.js';
import cors from 'cors';

// Initialize the database connection
initializeDatabase();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'dist')));

app.use(cors());

// Body parsing middleware
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running correctly.' });
});

// All other GET requests not handled before will return the React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
