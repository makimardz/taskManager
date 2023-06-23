const dbConfig = require('../db/config.js');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.task = require('./taskModel.js')(mongoose);
db.user = require('./userModel.js')(mongoose);

module.exports = db;