require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tests', require('./routes/tests'));
app.use('/api/routines', require('./routes/routines'));
app.use('/api/scalp', require('./routes/scalp'));
app.use('/api/appointments', require('./routes/appointments'));

// Serve the static frontend
const clientDir = path.join(__dirname, '..', 'client');
app.use(express.static(clientDir));

// Any non-API route falls back to index.html (simple SPA-style fallback)
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ msg: 'Not found' });
  }
  res.sendFile(path.join(clientDir, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

