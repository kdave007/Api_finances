
const port = process.env.PORT || 3000;

import express from 'express';
import { router } from './routes/user.js';
import { connectDB } from './config/db.js';

const app = express();

// Connect to the database
connectDB();

app.use('/', router);
app.use(express.json());


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
