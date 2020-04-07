var express = require('express');
var path = require('path');
var app = express();
var http = require('http');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
PORT = process.env.PORT || 3000;

// Get Index
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
// Get style sheets
app.get('/styles.css', function(req, res) {
    res.sendFile(path.join(__dirname + '/styles.css'));
});
// Get data
app.get('/calculations.json', function(req, res) {
    res.sendFile(path.join(__dirname + '/calculations.json'));
});
// Post data
app.post('/postCalculations', function(req, res) {
    addCalc(req.body);
    res.redirect(req.get('referer'));
});
// Start server
var server = app.listen(PORT, function () {
   var host = server.address().address;
   var port = server.address().port;
   console.log(`Listening at http://localhost:${PORT}`);
});

// Setup socketio for concurrency
var io = require('socket.io').listen(server);

// Process and add calculation data to JSON file
function addCalc(body){
  var fs = require('fs');
  var file_path = 'calculations.json';
  fs.readFile(file_path, function (err, data) {
    // Evaluate expression
    expression = body.calculation +"=" + eval(body.calculation);
    var entry = {
      timeStamp: Date.now(),
      calculation: expression
    }
    // Add to "database"
    var json = JSON.parse(data);
    json.entries.unshift(entry);
    fs.writeFileSync(file_path, JSON.stringify(json));
  });
  // Broadcast change
  io.emit('update');
}
