const db = require('../config/db');

const Contribution = {
  // Record monthly contribution
  create: async (contributionData) => {
    const { group_id, user_id, amount, month, proof_of_payment } = contributionData;
    const [result] = await db.query(
      'INSERT INTO contributions (group_id, user_id, amount, month, proof_of_payment) VALUES (?, ?, ?, ?, ?)',
      [group_id, user_id, amount || 1000, month, proof_of_payment]
    );
    return result.insertId;
  },

  // Get member's total contributions for the year
  getTotalByMember: async (userId, year) => {
    const [rows] = await db.query(
      `SELECT SUM(amount) as total FROM contributions 
       WHERE user_id = ? AND YEAR(month) = ? AND status = 'approved'`,
      [userId, year]
    );
    return rows[0].total || 0;
  }
};

module.exports = Contribution;