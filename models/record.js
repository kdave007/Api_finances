import sql from 'mssql';
import { getPool } from '../config/db.js';

export const getIncomeRecords = async () => {
  try {
    const result = await sql.query` SELECT TOP(200) 
      Income_detail.id, 
      income_amount as incomeAmount,
      tip_amount as tipAmount,
      concept,
      description,
      input_date as inputDate,
      input_id as inputId,
      state,
      income_form as incomeForm,
      tip_form as tipForm

      FROM Income
      JOIN Income_detail
      ON Income.detail_id = Income_detail.id
      ORDER BY input_date ASC;
    `;
    return result.recordset;
  } catch (err) {
    throw new Error('Database query error: ' + err.message);
  }
};


export const getOutcomeRecords = async () => {
  try {
    const result = await sql.query` SELECT TOP(200) 
      id, 
      amount,
      concept,
      description,
      input_date as inputDate,
      input_id as inputId,
      state,
      form as incomeForm

      FROM Outcome_detail

      ORDER BY input_date ASC;
    `;
    return result.recordset;
  } catch (err) {
    throw new Error('Database query error: ' + err.message);
  }
};


export const insertIncome = async (values) => {
  const pool = getPool();
  const transaction = new sql.Transaction(pool);
  
  try {
    await transaction.begin();
    const request1 = new sql.Request(transaction);
    
    await request1.query`  INSERT INTO Income_detail (
        input_id,
        input_date,
        state,
        income_form,
        tip_form,
        concept,
        description
      ) 

      OUTPUT INSERTED.id  
      
      VALUES (
        ${values.inputId},
        ${values.inputDate},
        ${values.state},
        ${values.incomeForm},
        ${values.tipForm},
        ${values.concept},
        ${values.description}
      )`;

    const insertedId = result.recordset[0].id;

    const request2 = new sql.Request(transaction);
    await request2.query`
        INSERT INTO Income (detail_id, income_amount, tip_amount)
        VALUES (${insertedId}, ${values.incomeAmount}, ${values.tipAmount})
      `;
  
    await transaction.commit();

    return { insertedId };
  } catch (err) {

    try {
      await transaction.rollback();
      console.error('Transaction rolled back due to error:', err);
    } catch (rollbackError) {
      console.error('Error rolling back transaction:', rollbackError);
    }
    throw new Error('Transaction error: ' + err.message);
  
  }
};


export const insertOutcome = async (values) => {
  const pool = getPool();
  const transaction = new sql.Transaction(pool);
  
  try {
    await transaction.begin();
    const request1 = new sql.Request(transaction);

    await request1.query`  INSERT INTO Outcome_detail (
        amount,    
        input_id,
        input_date,
        state,
        form,
        concept,
        description
      ) 
      
      VALUES (
        ${values.amount},
        ${values.inputId},
        ${values.inputDate},
        ${values.state},
        ${values.outcomeForm},
        ${values.concept},
        ${values.description}
      )`;
  
    await transaction.commit();

    return "Done!";

  } catch (err) {

    try {
      await transaction.rollback();
      console.error('Transaction rolled back due to error:', err);
    } catch (rollbackError) {
      console.error('Error rolling back transaction:', rollbackError);
    }
    throw new Error('Transaction error: ' + err.message);
  
  }
};


export const updateIncome = async (values) => {
  const pool = getPool();
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();
    const request1 = new sql.Request(transaction);

    await request1.query`
      UPDATE Income_detail
      SET
        input_date = ${values.inputDate},
        state = ${values.state},
        income_form = ${values.incomeForm},
        tip_form = ${values.tipForm},
        concept = ${values.concept},
        description = ${values.description}
      WHERE id = ${values.id}
    `;

    const request2 = new sql.Request(transaction);
    await request2.query`
      UPDATE Income
      SET
        income_amount = ${values.incomeAmount},
        tip_amount = ${values.tipAmount}
      WHERE detail_id = ${values.id}
    `;

    await transaction.commit(); // Commit the transaction
    console.log('Transaction committed.');

  } catch (err) {
    await transaction.rollback(); // Rollback the transaction on error
    console.error('Transaction error:', err);
    throw err; 
  }
};


export const updateOutcome = async (values) => {
  const pool = getPool();
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();
    const request1 = new sql.Request(transaction);
    
    await request1.query`
      UPDATE Outcome_detail
      SET
        input_date = ${values.inputDate},
        state = ${values.state},
        form = ${values.outcomeForm},
        amount = ${values.amount},
        concept = ${values.concept},
        description = ${values.description}
      WHERE id = ${values.id}
    `;

    await transaction.commit(); // Commit the transaction
    console.log('Transaction committed.');

  } catch (err) {
    await transaction.rollback(); // Rollback the transaction on error
    console.error('Transaction error:', err);
    throw err; 
  }
};


export const deleteModel = async (id) => {
  try {
    const result = await sql.query`DELETE FROM models WHERE id = ${id}`;
    return result;
  } catch (err) {
    throw new Error('Database query error: ' + err.message);
  }
};
