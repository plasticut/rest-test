const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser());
app.use('/api', require('./api'));

app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({error: err.message}).end();
});

module.exports = app;
