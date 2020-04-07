var express = require('express');
var path = require('path');
var app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
port = 3000;
const date = new Date();


// Methods
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/calculations.json', function(req, res) {
    res.sendFile(path.join(__dirname + '/calculations.json'));
});

app.post('/postCalculations', function(req, res) {
    addCalc(req.body);
    res.redirect(req.get('referer'));
});

var server = app.listen(port, function () {
   var host = server.address().address;
   var port = server.address().port;
   console.log(`Listening at http://localhost:${port}`);
});

// Functions

function addCalc(body){
  console.log(body);
  var fs = require('fs');
    var file_path = 'calculations.json';
    fs.readFile(file_path, function (err, data) {
      expression = body.calculation +"=" + eval(body.calculation);
      console.log(expression)
      var entry = {
        timeStamp: Date.now(),
        calculation: expression
      }
      var json = JSON.parse(data);
      json.entries.unshift(entry);
      console.log(entry);
      fs.writeFileSync(file_path, JSON.stringify(json));
    });
}
