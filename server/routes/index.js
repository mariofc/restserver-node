const express = require('express');

var app = express();

app.use(require('./usuarios'))
app.use(require('./login'))

module.exports = app;