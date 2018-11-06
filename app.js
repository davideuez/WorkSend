var express = require('express');
var app = express();

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.use('/', express.static('public/login'));

app.listen(port, function() {
    console.log('Server running on port ', port);
    });

// Handling GET requests
app.get('/', function(req, res){ 
    res.send('You are in the main route!'); 
  });

app.get('/hello', function(req, res){ 
    res.send('Hello World!'); 
  });