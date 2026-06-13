import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import bikeRoutes from './routes/bikeRoutes.js';
import rawMaterialRoutes from './routes/rawMaterialRoutes.js';
import assembleRoutes from './routes/assembleRoutes.js';
import saleRoutes from './routes/saleRoutes.js';


const app = express();

app.set('trust proxy', 1);

// Middleware to ensure database is connected before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed. Please check MONGODB_URI and IP access rules.',
      error: err.message
    });
  }
});

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'https://bike-vendor.vercel.app'
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.json({ message: 'API is running successfully...' });
});

app.use('/api/auth', authRoutes);
app.use('/api/bikes', bikeRoutes);
app.use('/api/raw-materials', rawMaterialRoutes);
app.use('/api/assembles', assembleRoutes);
app.use('/api/sales', saleRoutes);


app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

export default app;
