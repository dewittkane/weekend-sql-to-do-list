const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');


router.get('/', (req, res) => {
    let queryText = 'SELECT * FROM "tasks" ORDER BY "id";';
    //sends select request to postgres

    pool.query(queryText).then(result => {
      // Sends back the results in an object

      res.send(result.rows);
      //we only want the data in the rows, not the other info
    })
    .catch(error => {
      console.log('error getting list', error);
      res.sendStatus(500);
    });
  });//routes ajax GET request to the DB



module.exports = router;