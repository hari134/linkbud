const express = require('express');
const cors = require('cors');
const app = express();
const connectToMongoDB = require('./middleware/MongoConnect'); // Import the middleware
const publicRoutes = require('./routes/PublicRoutes')
const privateRoutes = require('./routes/PrivateRoutes');

async function startServer() {
  try {
    // Connect to the database
    await connectToMongoDB();

    // Enable CORS for all routes
    app.use(cors());

    // API routes
    app.use(publicRoutes);
    app.use(privateRoutes);

    // Start the server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

// Start the server
startServer();
