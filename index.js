const express = require('express');
const app = express();
const connectToMongoDB = require('./middleware/MongoConnect'); // Import the middleware
const publicRoutes = require('./routes/PublicRoutes')
const privateRoutes = require('./routes/PrivateRoutes');


// Connect to the database
connectToMongoDB();
app.get('/',(req,res)=>{
  res.send("test");
});

// API routes
app.use(publicRoutes);
app.use(privateRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;