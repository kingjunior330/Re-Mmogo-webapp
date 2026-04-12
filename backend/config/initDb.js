const db = require('./db');

const createTables = async () => {
  try {
    // Users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        is_signatory BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Users table created');

    // Groups table
    await db.query(`
      CREATE TABLE IF NOT EXISTS groups (
        id INT PRIMARY KEY AUTO_INCREMENT,
        group_name VARCHAR(100) NOT NULL,
        description TEXT,
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `);
    console.log('✓ Groups table created');

    // Group members table
    await db.query(`
      CREATE TABLE IF NOT EXISTS group_members (
        id INT PRIMARY KEY AUTO_INCREMENT,
        group_id INT,
        user_id INT,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (group_id) REFERENCES groups(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    console.log('✓ Group members table created');

    // Contributions table (P1000 monthly)
    await db.query(`
      CREATE TABLE IF NOT EXISTS contributions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        group_id INT,
        user_id INT,
        amount DECIMAL(10,2) DEFAULT 1000.00,
        month DATE,
        proof_of_payment VARCHAR(255),
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        approved_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (group_id) REFERENCES groups(id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (approved_by) REFERENCES users(id)
      )
    `);
    console.log('✓ Contributions table created');

    // Loans table
    await db.query(`
      CREATE TABLE IF NOT EXISTS loans (
        id INT PRIMARY KEY AUTO_INCREMENT,
        group_id INT,
        user_id INT,
        amount DECIMAL(10,2),
        interest_rate DECIMAL(5,2) DEFAULT 20.00,
        balance DECIMAL(10,2),
        status ENUM('pending', 'approved', 'rejected', 'paid') DEFAULT 'pending',
        approved_by_1 INT,
        approved_by_2 INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (group_id) REFERENCES groups(id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (approved_by_1) REFERENCES users(id),
        FOREIGN KEY (approved_by_2) REFERENCES users(id)
      )
    `);
    console.log('✓ Loans table created');

    // Loan payments table
    await db.query(`
      CREATE TABLE IF NOT EXISTS loan_payments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        loan_id INT,
        amount DECIMAL(10,2),
        interest_paid DECIMAL(10,2),
        payment_date DATE,
        proof_of_payment VARCHAR(255),
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        approved_by INT,
        FOREIGN KEY (loan_id) REFERENCES loans(id),
        FOREIGN KEY (approved_by) REFERENCES users(id)
      )
    `);
    console.log('✓ Loan payments table created');

    console.log('✅ All tables created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating tables:', error);
    process.exit(1);
  }
};

createTables();