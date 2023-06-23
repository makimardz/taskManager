const express = require('express');
/*
const mongodb = require('./db/config');

require('dotenv').config();
*/
const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app
.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  })
.use('/', require('./routes'));


const db = require('./models');
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`DB Connected and server running on ${port}.`);
    });
  })
  .catch((err) => {
    console.log('Cannot connect to the database!', err);
    process.exit();
  });