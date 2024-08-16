const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');

// Routes
const studentRoutes = require('./routes/UserRoute');
const complaintRoutes = require('./routes/complainRoute');

const app = express();
app.use(express.json());
app.use(cors());

const dotenv = require('dotenv');     // for .env file
dotenv.config();

const atlasConnection = process.env.MONGODB_URI;

mongoose.set('strictQuery', true);

mongoose.connect(atlasConnection, {
  serverSelectionTimeoutMS: 100000
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch(err => {
  console.error('Error connecting to MongoDB Atlas:', err);
});

const server = http.createServer(app);



// ROutes use
app.use('/user', studentRoutes);
app.use('/complaint', complaintRoutes);
//

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log('MongoDB connected.');
});
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Process terminated');
  });
});

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});