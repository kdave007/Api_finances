import sql from 'mssql';
import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
  server: process.env.DB_SERVER,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true, // Use encryption for data privacy
    enableArithAbort: true, // Handle arithmetic errors
    trustServerCertificate: true
  },

};

let pool;

export async function connectDB() {
  try {
    pool = await sql.connect(dbConfig);
    console.log('Connected to the SQL Server database');
  } catch (err) {
    console.error('Database connection error:', err);
  }
}


export function getPool() {
  if (!pool) {
    throw new Error('Connection pool not initialized. Call connectDB first.');
  }
  return pool;
}





