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

// Fix __dirname for ES modules
const __dirname = path.resolve();

// ✅ Middleware
app.use(cors({
    origin: true, // allow all (fix for production)
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// ✅ Routes
app.use('/api/auth', authRoutes);

// ✅ Test route (optional but useful)
app.get("/api/test", (req, res) => {
    res.send("API working ✅");
});

// ✅ Serve frontend (IMPORTANT FIXED PART)
if (process.env.NODE_ENV === 'production') {
    const frontendPath = path.join(__dirname, '../sanchay-frontend/dist');

    app.use(express.static(frontendPath));

    app.get('*', (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'));
    });
}

// ✅ Start server
app.listen(PORT, () => {
    console.log('🚀 Server running on port:', PORT);
    connectDB();
});