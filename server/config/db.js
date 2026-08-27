const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn('No MONGO_URI set — running without a database. Pages will load, but login/signup and saving will not work until you add one.');
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.warn('Continuing without a database — pages will load, but login/signup and saving will not work.');
  }
};

module.exports = connectDB;