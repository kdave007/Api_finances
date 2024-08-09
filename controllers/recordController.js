import { getIncomeRecords, getOutcomeRecords, insertIncome, insertOutcome, updateIncome, updateOutcome } from '../models/record.js';

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

export const deleteExistingModel = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteModel(id);
    if (result.rowsAffected[0] > 0) {
      res.send('Model deleted successfully');
    } else {
      res.status(404).send('Model not found');
    }
  } catch (err) {
    res.status(500).send('Server SQL Error: ' + err.message);
  }
};
