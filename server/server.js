const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const app = express();
const PORT = process.env.PORT || 5000;
app.use( bodyParser.urlencoded( {extended:true} ));
app.use( express.static('server/public'));
app.listen( PORT, () => {
    console.log( 'listening on port', PORT );
  });
//server boilerplate

const listRouter = require( './routes/list.router.js' )
app.use( '/list', listRouter )
//routes /list requests to appropriate router

const editTaskRouter = require( './routes/edittask.router.js' )
app.use( '/edittask', editTaskRouter )
//routes /edittask requests to appropriate router