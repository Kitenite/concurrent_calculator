var express = require('express');
var path = require('path');
var app = express();
var http = require('http');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
PORT = 3000;

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



// io.sockets.on('connection', function(socket) {
//   console.log("User connected");
//   fs.watchFile('./calculations.json', {persistent:true}, function(data) {
//       socket.emit('server', {message: 'File changed'});
//   });
// });

var server = app.listen(PORT, function () {
   var host = server.address().address;
   var port = server.address().port;
   console.log(`Listening at http://localhost:${PORT}`);
});

// Socket.io
var io = require('socket.io').listen(server);
// Functions
function addCalc(body){
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
      fs.writeFileSync(file_path, JSON.stringify(json));
    });
  io.emit('update');
}
