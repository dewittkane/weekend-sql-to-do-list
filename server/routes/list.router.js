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

  router.post('/',  (req, res) => {
    let newTask = req.body;
    console.log(`Adding task`, newTask);
    /* expected object = {
        task: 'Input Value'
    }
    */
  
    let queryText = `INSERT INTO "tasks" ("task")
                     VALUES ($1);`;
                    //Data ~*~*~*~Sanitization~*~*~*~, prevents SQL injection
    pool.query(queryText, [newTask.task])
      .then(result => {
        res.sendStatus(201);
        //sends AOK status back if posted successfully
      })
      .catch(error => {
        console.log(`Error adding new task`, error);
        res.sendStatus(500);
      });
  });

module.exports = router;