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

router.post('/', (req, res) => {
    let newTask = req.body;
    console.log(`Adding task`, newTask);
    /* expected object = {
        task: 'Input Value'
    }*/

    let queryText = `INSERT INTO "tasks" ("task")
                        VALUES ($1);`;
    //Data ~*~*~*~Sanitization~*~*~*~, prevents SQL injection
    pool.query(queryText, [newTask.task])
        .then(result => {
            res.sendStatus(201);
            //sends AOK status back if posted successfully
        }).catch(error => {
            console.log(`Error adding new task`, error);
            res.sendStatus(500);
        });
});//routes ajax POST request to the DB

router.delete('/:id', (req, res) => {
    let id = req.params.id; // id of the thing to delete
    console.log('Delete route called with id of', id);
    let query = `
    DELETE FROM "tasks"
    WHERE "id" = $1;
    `
    pool.query(query, [id])
        .then((response) => {
            console.log(response);
            res.sendStatus(200);
        }).catch((error) => {
            res.sendStatus(500);
        });
});//routes ajax DELETE request to the DB

module.exports = router;