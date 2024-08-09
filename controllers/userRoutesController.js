import sql from 'mssql';

const  testEndPoint = async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM models`; 
        console.log(result);
        res.json(result.recordset);
      } catch (err) {
        res.status(500).send('Server SQL Error');
      }
}

const  addRecord = async (req, res) => {
  try {
      const result = await record.insertNew(req);
      console.log(result);
      res.json(result.recordset);
    } catch (err) {
      res.status(500).send('Server SQL Error');
    }
}

const  testpost =  (req, res) => { 
  console.log("POST REQUEST RECEIVED")
    console.log(req.body);
    res.status(200).send();
}

export {
    testEndPoint,testpost,addRecord
}