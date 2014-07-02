var express = require('express');
var path = require('path');
var request = require('request');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.listen(8000, function() {
  console.log('Listening on port 8000')
})
