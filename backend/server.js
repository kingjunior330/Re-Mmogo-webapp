const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, query } = require('./config/db');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Test database connection endpoint
app.get('/test-db', async (req, res) => {
  try {
    await connectDB();
    const result = await query('SELECT GETDATE() as server_time, @@VERSION as version');
    res.json({ 
      message: 'SQL Server connected successfully',
      server_time: result.recordset[0].server_time,
      sql_version: result.recordset[0].version.split('\n')[0]
    });
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
});

// Simple test endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Re-Mmogo API is running with SQL Server' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Test connection on startup
  connectDB().catch(console.error);
});