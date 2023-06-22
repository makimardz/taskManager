const express = require('express');
const mongodb = require('./db/config');

require('dotenv').config();

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app
.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  })
.use('/', require('./routes'));


mongodb.initDb((err, mongodb) => {
    if (err) {
      console.log(err);
    } else {
      app.listen(port);
      console.log(`Connected to DB and listening on ${port}`);
    }
  }); 
