const sql = require('mssql');

const sqlConfig = {
  server: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 1433,
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ReMmogoDB',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true
  }
};

let pool = null;

const connectDB = async () => {
  try {
    if (!pool) {
      pool = await sql.connect(sqlConfig);
      console.log('✅ SQL Server connected successfully');
    }
    return pool;
  } catch (err) {
    console.error('❌ SQL Server connection failed:', err.message);
    throw err;
  }
};

// Helper function for queries
const query = async (queryString, params = []) => {
  try {
    const pool = await connectDB();
    const request = pool.request();
    
    // Add parameters if any
    params.forEach((param, index) => {
      request.input(`param${index}`, param);
    });
    
    const result = await request.query(queryString);
    return result;
  } catch (err) {
    console.error('Query error:', err.message);
    throw err;
  }
};

module.exports = { connectDB, query, sql };