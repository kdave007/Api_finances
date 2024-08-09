import express from 'express';
const router = express.Router();
import { addIncome, getRecords, addOutcome, updateIncomeRecord, updateOutcomeRecord } from '../controllers/recordController.js';
import bodyParser from 'body-parser';

var jsonParser = bodyParser.json()

//GET
router.get('/',  getRecords );

//POST
router.post('/addIncome',  jsonParser, addIncome );
router.post('/addOutcome',  jsonParser, addOutcome );
router.post('/updateIncome',  jsonParser, updateIncomeRecord );
router.post('/updateOutcome',  jsonParser, updateOutcomeRecord );


export { router };
