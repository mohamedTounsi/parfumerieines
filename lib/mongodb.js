import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI in .env.local');
}

let cached = globalThis.mongoose || {};  // Use globalThis for universal access

// Ensuring global object caching
if (!cached.conn) {
  cached.conn = null;
}
if (!cached.promise) {
  cached.promise = null;
}

async function connectDB() {
  if (cached.conn) return cached.conn; // If already connected, return the cached connection

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      useNewUrlParser: true, // Optional - for new URL parser (Mongoose deprecated default URL parser)
      useUnifiedTopology: true, // Optional - to avoid deprecation warnings in the future
    }).catch((err) => {
      console.error('MongoDB connection error:', err);
      throw new Error('Failed to connect to MongoDB');
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
