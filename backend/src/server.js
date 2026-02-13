const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');           // ✅ This is correct (./config/db)
const leadRoutes = require('./routes/leadRoutes');  // ✅ This is correct (./routes/leadRoutes)
const authRoutes = require('./routes/authRoutes');  // ✅ This is correct (./routes/authRoutes)
const userRoutes = require('./routes/userRoutes');  // ✅ This is correct (./routes/userRoutes)

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/users', userRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'CRM API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});