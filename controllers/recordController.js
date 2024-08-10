import { getIncomeRecords, getOutcomeRecords, insertIncome, insertOutcome, updateIncome, updateOutcome, softDeleteOutcomeRecords, softDeleteIncomeRecords } from '../models/record.js';

export const getRecords = async (req, res) => {
  try {
    console.log("GET REQUEST RECEIVED");
    const income = await getIncomeRecords();
    const outcome = await getOutcomeRecords();

    res.json({
      income,
      outcome
    });
  } catch (err) {
    res.status(500).send('Server SQL Error: ' + err.message);
  }
};

export const addIncome = async (req, res) => {
  console.log(req.body);
 
  try {
    const values = req.body;
    await insertIncome(values);

    res.status(201).send('insertion successfully');
  } catch (err) {
    console.log(err)
    res.status(500).send('Server SQL Error: ' + err.message);
  }
};

export const addOutcome = async (req, res) => {
  console.log(req.body);
 
  try {
    const values = req.body;
    await insertOutcome(values);

    res.status(201).send('insertion successfully');
  } catch (err) {
    console.log(err)
    res.status(500).send('Server SQL Error: ' + err.message);
  }
};


export const updateIncomeRecord = async (req, res) => {
  console.log(req.body);
 
  try {
    const values = req.body;
    await updateIncome(values);

    res.status(201).send('updated successfully');
  } catch (err) {
    console.log(err)
    res.status(500).send('Server SQL Error: ' + err.message);
  }
};


export const updateOutcomeRecord = async (req, res) => {
  console.log(req.body);
 
  try {
    const values = req.body;
    await updateOutcome(values);

    res.status(201).send('updated successfully');
  } catch (err) {
    console.log(err)
    res.status(500).send('Server SQL Error: ' + err.message);
  }
};

export const deleteRecords = async (req, res) => {
  try {
    const { incomeRecords, outcomeRecords } = req.body;

    // Soft delete income records
    if (incomeRecords && incomeRecords.length > 0) {
      await softDeleteIncomeRecords(incomeRecords);
    }

    // Soft delete outcome records
    if (outcomeRecords && outcomeRecords.length > 0) {
      await softDeleteOutcomeRecords(outcomeRecords);
    }

    res.status(200).json({ message: 'Records soft deleted successfully.' });
    
  } catch (err) {
    res.status(500).json({
      error: 'An error occurred while soft deleting records.',
      details: err.message
    });
  }
};
