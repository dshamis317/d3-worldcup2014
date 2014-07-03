var express = require('express');
var path = require('path');
var request = require('request');
var bodyParser = require('body-parser');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(process.env.PORT, function() {
  console.log('Listening on port %d');
})

app.post('/team', function(req, res) {
  var team = req.body.teamName;
  res.send({ teamName: team });
})

app.get('/team/:team_name', function(req, res) {
  var team = req.params.team_name
  request('http://worldcup.sfg.io/matches/country?fifa_code='+ team, function(err, response, body) {
    if (!err && response.statusCode == 200) {
      res.send(body);
    }
  })
})
