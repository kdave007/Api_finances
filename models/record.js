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
      status,
      income_form as incomeForm,
      tip_form as tipForm

      FROM Income
      JOIN Income_detail
      ON Income.detail_id = Income_detail.id
      WHERE status > 0
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
      status,
      form as incomeForm

      FROM Outcome_detail
      WHERE status > 0
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
        status,
        income_form,
        tip_form,
        concept,
        description
      ) 

      OUTPUT INSERTED.id  
      
      VALUES (
        ${values.inputId},
        ${values.inputDate},
        ${values.status},
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
        status,
        form,
        concept,
        description
      ) 
      
      VALUES (
        ${values.amount},
        ${values.inputId},
        ${values.inputDate},
        ${values.status},
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
        status = ${values.status},
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
        status = ${values.status},
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
//***************** SOFT DELETE *********************************

export const softDeleteIncomeRecords = async (incomeRecords) => {
  const pool = getPool();
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    for (const record of incomeRecords) {
      
      const request = new sql.Request(transaction);
      await request.query`
        UPDATE Income_detail
        SET status = 0
        WHERE id = ${record.id} AND status != 0
      `;
      
    }

    await transaction.commit();
    console.log('Income records deleted successfully.');
    return { success: true };
  } catch (err) {
    await transaction.rollback();
    console.error('Transaction error:', err);
    throw err; // Re-throw the error to be handled by the controller
  }
};

export const softDeleteOutcomeRecords  = async (outcomeRecords) => {
  const pool = getPool();
  const transaction = new sql.Transaction(pool);
 
  console.log("soft delete outcome",outcomeRecords);

  try {
    await transaction.begin();

    for (const record of outcomeRecords) {
      
      const request = new sql.Request(transaction);
      await request.query`
        UPDATE Outcome_detail
        SET status = 0
        WHERE id = ${record.id} AND status != 0
      `;
      
    }

    await transaction.commit();
    console.log('Outcome records deleted successfully.');
    return { success: true };
  } catch (err) {
    await transaction.rollback();
    console.error('Transaction error:', err);
    throw err; // Re-throw the error to be handled by the controller
  }
};