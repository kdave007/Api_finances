import sql from 'mssql';
import { getPool } from '../config/db.js';

export const restoreIncomeRecords = async (incomeRecords) => {
  const pool = getPool();
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    for (const record of incomeRecords) {
      const request = new sql.Request(transaction);
      await request.query`
        UPDATE Income_detail
        SET status = 1
        WHERE id = ${record.id} AND status = 0
      `;
    }

    await transaction.commit();
    console.log('Income records restored successfully.');
    return { success: true };
  } catch (err) {
    await transaction.rollback();
    console.error('Transaction error:', err);
    throw err; // Re-throw the error to be handled by the controller
  }
};

export const restoreOutcomeRecords = async (outcomeRecords) => {
  const pool = getPool();
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    for (const record of outcomeRecords) {
      const request = new sql.Request(transaction);
      await request.query`
        UPDATE Outcome_detail
        SET status = 1
        WHERE id = ${record.id} AND status = 0
      `;
    }

    await transaction.commit();
    console.log('Outcome records restored successfully.');
    return { success: true };
  } catch (err) {
    await transaction.rollback();
    console.error('Transaction error:', err);
    throw err; // Re-throw the error to be handled by the controller
  }
};
