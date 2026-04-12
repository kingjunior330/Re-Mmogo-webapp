const sql = require('mssql');
require('dotenv').config({ path: '../.env' });

const initDatabase = async () => {
  try {
    // Connection config without database
    const masterConfig = {
      server: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 1433,
      user: process.env.DB_USER || 'sa',
      password: process.env.DB_PASSWORD || '',
      options: {
        encrypt: false,
        trustServerCertificate: true
      }
    };
    
    console.log('Connecting to SQL Server...');
    const masterPool = await sql.connect(masterConfig);
    
    // Create database if it doesn't exist
    await masterPool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'ReMmogoDB')
      BEGIN
        CREATE DATABASE ReMmogoDB
      END
    `);
    console.log('✓ Database ensured');
    
    await masterPool.close();
    
    // Connect to the database
    const dbConfig = {
      ...masterConfig,
      database: 'ReMmogoDB'
    };
    
    const pool = await sql.connect(dbConfig);
    console.log('Connected to ReMmogoDB');
    
    // Create Users table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
      BEGIN
        CREATE TABLE Users (
          id INT IDENTITY(1,1) PRIMARY KEY,
          name NVARCHAR(100) NOT NULL,
          email NVARCHAR(100) UNIQUE NOT NULL,
          password_hash NVARCHAR(255) NOT NULL,
          is_signatory BIT DEFAULT 0,
          created_at DATETIME DEFAULT GETDATE()
        )
        PRINT 'Users table created'
      END
    `);
    
    // Create Groups table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Groups')
      BEGIN
        CREATE TABLE Groups (
          id INT IDENTITY(1,1) PRIMARY KEY,
          group_name NVARCHAR(100) NOT NULL,
          description NVARCHAR(500),
          created_by INT,
          created_at DATETIME DEFAULT GETDATE(),
          FOREIGN KEY (created_by) REFERENCES Users(id)
        )
        PRINT 'Groups table created'
      END
    `);
    
    // Create GroupMembers table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'GroupMembers')
      BEGIN
        CREATE TABLE GroupMembers (
          id INT IDENTITY(1,1) PRIMARY KEY,
          group_id INT,
          user_id INT,
          joined_at DATETIME DEFAULT GETDATE(),
          FOREIGN KEY (group_id) REFERENCES Groups(id),
          FOREIGN KEY (user_id) REFERENCES Users(id)
        )
        PRINT 'GroupMembers table created'
      END
    `);
    
    // Create Contributions table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Contributions')
      BEGIN
        CREATE TABLE Contributions (
          id INT IDENTITY(1,1) PRIMARY KEY,
          group_id INT,
          user_id INT,
          amount DECIMAL(10,2) DEFAULT 1000.00,
          contribution_month DATE,
          proof_of_payment NVARCHAR(500),
          status NVARCHAR(20) DEFAULT 'pending',
          approved_by INT,
          created_at DATETIME DEFAULT GETDATE(),
          FOREIGN KEY (group_id) REFERENCES Groups(id),
          FOREIGN KEY (user_id) REFERENCES Users(id),
          FOREIGN KEY (approved_by) REFERENCES Users(id)
        )
        PRINT 'Contributions table created'
      END
    `);
    
    // Create Loans table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Loans')
      BEGIN
        CREATE TABLE Loans (
          id INT IDENTITY(1,1) PRIMARY KEY,
          group_id INT,
          user_id INT,
          amount DECIMAL(10,2),
          interest_rate DECIMAL(5,2) DEFAULT 20.00,
          balance DECIMAL(10,2),
          status NVARCHAR(20) DEFAULT 'pending',
          approved_by_1 INT,
          approved_by_2 INT,
          created_at DATETIME DEFAULT GETDATE(),
          FOREIGN KEY (group_id) REFERENCES Groups(id),
          FOREIGN KEY (user_id) REFERENCES Users(id),
          FOREIGN KEY (approved_by_1) REFERENCES Users(id),
          FOREIGN KEY (approved_by_2) REFERENCES Users(id)
        )
        PRINT 'Loans table created'
      END
    `);
    
    // Create LoanPayments table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'LoanPayments')
      BEGIN
        CREATE TABLE LoanPayments (
          id INT IDENTITY(1,1) PRIMARY KEY,
          loan_id INT,
          amount DECIMAL(10,2),
          interest_paid DECIMAL(10,2),
          payment_date DATE,
          proof_of_payment NVARCHAR(500),
          status NVARCHAR(20) DEFAULT 'pending',
          approved_by INT,
          FOREIGN KEY (loan_id) REFERENCES Loans(id),
          FOREIGN KEY (approved_by) REFERENCES Users(id)
        )
        PRINT 'LoanPayments table created'
      END
    `);
    
    console.log('\n✅ All tables created successfully!');
    await pool.close();
    process.exit(0);
    
  } catch (err) {
    console.error('Error:', err.message);
    console.error('Full error:', err);
    process.exit(1);
  }
};

// Run the initialization
initDatabase();