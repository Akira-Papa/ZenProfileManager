import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { 
    conn: null, 
    promise: null 
  };
}

// Clear cache if connection fails
process.on('unhandledRejection', (error: any) => {
  console.error('Unhandled promise rejection:', error);
  if (error.name === 'MongoNetworkError') {
    cached.conn = null;
    cached.promise = null;
  }
});

async function connectDB() {
  try {
    // Validate MongoDB URI
    if (!process.env.MONGODB_URI) {
      throw new Error('MongoDB URI is not defined');
    }

    if (cached.conn) {
      console.log('Using existing MongoDB connection');
      return cached.conn;
    }

    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        retryWrites: true,
        retryReads: true,
        maxPoolSize: 10,
        minPoolSize: 5,
      };

      console.log('Initializing new MongoDB connection...');
      cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then(mongoose => {
        console.log('MongoDB connection established successfully');
        mongoose.connection.on('error', (err) => {
          console.error('MongoDB connection error:', err);
        });
        mongoose.connection.on('disconnected', () => {
          console.warn('MongoDB disconnected');
        });
        mongoose.connection.on('reconnected', () => {
          console.log('MongoDB reconnected');
        });
        return mongoose;
      });
    }

    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error: any) {
    console.error('MongoDB connection error:', error.message);
    // Clear the cached connection and promise
    cached.promise = null;
    cached.conn = null;
    throw error;
  }
}

export default connectDB;
