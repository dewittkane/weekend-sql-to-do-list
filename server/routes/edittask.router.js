const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

router.put( '/:id', ( req, res )=>{
    console.log( 'Put route called:', req.params.id, req.body );
    const query = `UPDATE "tasks" SET task=$1 WHERE id=$2;`;
    const values =[ req.body.text, req.params.id ];

    pool.query( query, values ).then( (response)=>{
        console.log(response);
        res.sendStatus( 200 );
    }).catch( ( error )=>{
        console.log( 'error with update:', error );
        res.sendStatus( 500 );
    })
})//routes ajax PUT request to the DB


module.exports = router;