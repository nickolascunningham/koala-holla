const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// must require modules to use them
const pool = require( './modules/pool' );

const PORT = process.env.PORT || 5000;
const koalaRouter = require('./routes/koala.router')

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('server/public'));

// ROUTES
app.use('/koalas', koalaRouter)

// Start listening for requests on a specific port
app.listen(PORT, () => {
  console.log('listening on port', PORT);
});

app.get ('/koalas', (req,res)=>{
  const queryString = `SELECT*FROM koala`;
  pool.query(queryString).then((results)=>{
    res.send (results.rows);
  }).catch ((err)=>{
    console.log (err);
    res.sendStatus(500);
  })
})

app.post ('/koalas', (req,res)=>{
  console.log('/koalas POST hit:', req.body);
  let queryString = `INSERT INTO "koala" (name, age, sex, notes, ready_for_transfer) VALUES ($1, $2, $3, $4, $5)`;
  let values = [req.body.name, req.body.age, req.body.sex, req.body.notes, req.body.ready_for_transfer];
  pool.query(queryString, values).then((results)=>{
    res.sendStatus(201);
  }).catch((err)=>{
    console.log(err);
    res.sendStatus(500);
  })
})

app.delete( '/koalas', (req, res)=>{
  let queryString = `DELETE FROM "koala" where id=${req.query.id};`
  pool.query( queryString ).then( (results)=>{
    res.sendStatus( 200 );
  }).catch( (err)=>{
    console.log( err );
    res.sendStatus( 500 );
  })
})

app.put( '/koalas', (req, res)=>{
  console.log( '/koalas PUT:', req.query)
  let queryString = `UPDATE "koala" SET ready_for_transfer=true WHERE id=${ req.query.id};`
  pool.query( queryString ).then( (results)=>{
    res.sendStatus( 200 );
  }).catch( (err)=>{
    console.log( err );
    res.sendStatus( 500 );
  })
})