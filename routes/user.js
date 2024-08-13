import express from 'express';
const router = express.Router();
import { addIncome, getRecords, addOutcome, updateIncomeRecord, updateOutcomeRecord, deleteRecords } from '../controllers/recordController.js';
import bodyParser from 'body-parser';
import { restoreRecords } from '../controllers/recordRestoreController.js';

var jsonParser = bodyParser.json()

//GET
router.get('/',  getRecords );

//POST
router.post('/addIncome',  jsonParser, addIncome );
router.post('/addOutcome',  jsonParser, addOutcome );

router.post('/updateIncome',  jsonParser, updateIncomeRecord );
router.post('/updateOutcome',  jsonParser, updateOutcomeRecord );

router.post('/deleteRecords',  jsonParser, deleteRecords );

router.post('/RestoreRecords',  jsonParser, restoreRecords );




export { router };
