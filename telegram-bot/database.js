const mongoose = require('mongoose');
const messages = require('./messages');

// MongoDB connection configuration
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quiz-of-the-kings';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(messages.console.dbConnected);
  } catch (error) {
    console.error(messages.errors.dbConnectionFailed, error.message);
    process.exit(1);
  }
};

// Handle MongoDB connection events
mongoose.connection.on('disconnected', () => {
  console.log(messages.console.dbDisconnected);
});

mongoose.connection.on('error', (error) => {
  console.error(messages.errors.dbError, error);
});

module.exports = { connectDB };