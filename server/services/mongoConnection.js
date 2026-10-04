import mongoose from 'mongoose';

mongoose.set('bufferCommands', false);

const cacheKey = '__chiragAckermanMongoConnection';
const connectionCache = globalThis[cacheKey] || (globalThis[cacheKey] = {
  promise: null,
  retryAfter: 0,
  lastError: null
});
const isVercelDeployment = process.env.VERCEL === '1' && process.env.VERCEL_ENV !== 'development';
const CONNECTION_RETRY_DELAY_MS = 20000;

export function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

export function getMongoConnectionState() {
  return mongoose.connection.readyState;
}

export function connectToMongoDB() {
  if (isMongoConnected()) {
    connectionCache.retryAfter = 0;
    connectionCache.lastError = null;
    return Promise.resolve(mongoose.connection);
  }

  if (connectionCache.promise) {
    return connectionCache.promise;
  }

  if (!process.env.MONGODB_URI) {
    return Promise.reject(new Error('MONGODB_URI must be configured for the database connection.'));
  }

  if (connectionCache.retryAfter > Date.now()) {
    return Promise.reject(connectionCache.lastError);
  }

  const connectionPromise = mongoose.connection.readyState === 2
    ? mongoose.connection.asPromise()
    : mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      ...(isVercelDeployment ? { maxPoolSize: 5, maxIdleTimeMS: 10000 } : {})
    });

  connectionCache.promise = connectionPromise
    .then(() => {
      connectionCache.retryAfter = 0;
      connectionCache.lastError = null;
      return mongoose.connection;
    })
    .catch((error) => {
      connectionCache.retryAfter = Date.now() + CONNECTION_RETRY_DELAY_MS;
      connectionCache.lastError = error;
      throw error;
    })
    .finally(() => {
      connectionCache.promise = null;
    });

  return connectionCache.promise;
}
