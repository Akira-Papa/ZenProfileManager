import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env')
}

const uri = process.env.MONGODB_URI
const options: MongoClientOptions = {
  connectTimeoutMS: 10000,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  family: 4,
  retryWrites: true,
  retryReads: true,
  maxPoolSize: process.env.NODE_ENV === 'production' ? 50 : 10,
  minPoolSize: process.env.NODE_ENV === 'production' ? 10 : 5,
  keepAlive: true,
  writeConcern: {
    w: 'majority',
    wtimeoutMS: 2500,
  },
  compressors: ['zlib'] as ("snappy" | "zlib" | "none" | "zstd")[],
  directConnection: true
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

const connectWithRetry = async (retries = 3, delay = 1000): Promise<MongoClient> => {
  try {
    client = new MongoClient(uri, options);
    return await client.connect();
  } catch (error) {
    if (retries > 0) {
      console.warn(`MongoDB connection failed, retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return connectWithRetry(retries - 1, delay * 2);
    }
    throw error;
  }
};

if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    globalWithMongo._mongoClientPromise = connectWithRetry()
      .then(client => {
        console.log('MongoDB adapter connected successfully');
        return client;
      });
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  clientPromise = connectWithRetry()
    .then(client => {
      console.log('MongoDB adapter connected successfully');
      return client;
    });
}

// Handle cleanup
process.on('SIGTERM', async () => {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed due to app termination');
  }
});

export default clientPromise
