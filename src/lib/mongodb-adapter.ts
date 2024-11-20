import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env')
}

const uri = process.env.MONGODB_URI
const options = {
  connectTimeoutMS: 30000,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  retryReads: true,
  maxPoolSize: 10,
  minPoolSize: 5,
  keepAlive: true
}

let client
let clientPromise: Promise<MongoClient>

try {
  if (process.env.NODE_ENV === 'development') {
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>
    }

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options)
      globalWithMongo._mongoClientPromise = client.connect()
        .then(client => {
          console.log('MongoDB adapter connected successfully');
          return client;
        })
        .catch(error => {
          console.error('MongoDB adapter connection error:', error);
          throw error;
        });
    }
    clientPromise = globalWithMongo._mongoClientPromise
  } else {
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
      .then(client => {
        console.log('MongoDB adapter connected successfully');
        return client;
      })
      .catch(error => {
        console.error('MongoDB adapter connection error:', error);
        throw error;
      });
  }
} catch (error) {
  console.error('MongoDB adapter initialization error:', error);
  throw error;
}

export default clientPromise
