const http = require('node:http');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dbConfig = require('./config/db');
const app = express();
app.use(cors())

const DBURL = dbConfig.url;
const PORT = dbConfig.port;
const LOCAL_ADDRESS = dbConfig.hostname;

// Connecting to the database
mongoose.connect(DBURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,
  // useFindAndModify: false
}).then(() => {
  console.log("Successfully connected to the database");
}).catch(err => {
  console.log('Could not connect to the database. Exiting now...', err);
  process.exit();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false, useUnifiedTopology: true }))
// parse application/json
app.use(bodyParser.json());

// importing routes files
require('./routes/')(app);

const server = app.listen(PORT, LOCAL_ADDRESS, () => {
  console.log(`Server running at http://${LOCAL_ADDRESS}:${PORT}/`);
});