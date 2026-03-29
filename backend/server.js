import express from 'express';
import dotenv from 'dotenv'; 
import { connectDB } from './db/connectDB.js'; 
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

const __dirname = path.resolve();

// Middleware
app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);

app.get("/api/test", (req, res) => {
    res.send("API working ✅");
});

// ✅ ALWAYS serve frontend
const frontendPath = path.join(__dirname, '../sanchay-frontend/dist');

app.use(express.static(frontendPath));

// only handle root
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});
// Start server
app.listen(PORT, () => {
    console.log('🚀 Server running on port:', PORT);
    connectDB();
});