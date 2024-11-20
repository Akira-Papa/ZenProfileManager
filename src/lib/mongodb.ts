import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env');
}

const cached: {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
} = (global as any).mongoose || {
  conn: null,
  promise: null
};

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
    if (!process.env.MONGODB_URI) {
      throw new Error('MongoDB URI is not defined');
    }

    if (cached.conn) {
      return cached.conn;
    }

    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        family: 4,
        retryWrites: true,
        retryReads: true,
        maxPoolSize: process.env.NODE_ENV === 'production' ? 50 : 10,
        minPoolSize: process.env.NODE_ENV === 'production' ? 10 : 5,
        connectTimeoutMS: 10000,
        keepAlive: true,
        keepAliveInitialDelay: 300000,
        autoIndex: false // Don't build indexes in production
      };

      cached.promise = mongoose.connect(process.env.MONGODB_URI, opts)
        .then((mongoose) => {
          console.log('MongoDB connected successfully');
          
          mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
            cached.conn = null;
            cached.promise = null;
          });

          mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB disconnected, attempting reconnect...');
            cached.conn = null;
            cached.promise = null;
          });

          mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnected successfully');
          });

          return mongoose;
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error: any) {
    console.error('MongoDB connection error:', error.message);
    cached.promise = null;
    cached.conn = null;
    throw new Error(`Failed to connect to MongoDB: ${error.message}`);
  }
}

export default connectDB;
