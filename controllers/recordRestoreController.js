import { restoreIncomeRecords, restoreOutcomeRecords } from '../models/recordRestore.js';

export const restoreRecords = async (req, res) => {
  try {
    const { incomeRecords, outcomeRecords } = req.body;

    // Restore income records
    if (incomeRecords && incomeRecords.length > 0) {
      await restoreIncomeRecords(incomeRecords);
    }

    // Restore outcome records
    if (outcomeRecords && outcomeRecords.length > 0) {
      await restoreOutcomeRecords(outcomeRecords);
    }

    res.status(200).json({ message: 'Records restored successfully.' });
  } catch (err) {
    res.status(500).json({
      error: 'An error occurred while restoring records.',
      details: err.message
    });
  }
};
