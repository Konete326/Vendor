import mongoose from 'mongoose';

// Cache connection globally to reuse it across serverless function invocations
let cachedConnection = null;

const connectDB = async () => {
  // If database is already connected, reuse it
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  // If a connection is not already active, create a new one and cache the promise
  if (!cachedConnection) {
    try {
      cachedConnection = mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      const conn = await cachedConnection;
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      cachedConnection = null; // Reset cache on failure
      console.error(`Error connecting to MongoDB: ${error.message}`);
    }
  }

  return cachedConnection;
};

export default connectDB;
