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

// ✅ Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// ✅ Routes
app.use('/api/auth', authRoutes);



// ✅ Serve frontend in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../sanchay-frontendt')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, "sanchay-frontend",  "index.html"));
    });
}

// ✅ Start server
app.listen(PORT, () => {
    connectDB();
    console.log('🚀 Server is running on port:', PORT);
});
