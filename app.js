const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const classesRoute = require('./api/routes/classes');
const userRoute = require('./api/routes/user');
const assignmentsRoute = require('./api/routes/assignments');
const deliveriesRoute = require('./api/routes/deliveries');

mongoose.connect("mongodb://davide_uez:" + process.env.MONGO_ATLAS_PW + "@worksend-shard-00-00-l1h5a.mongodb.net:27017,worksend-shard-00-01-l1h5a.mongodb.net:27017,worksend-shard-00-02-l1h5a.mongodb.net:27017/Worksend_DB?ssl=true&replicaSet=WorkSend-shard-0&authSource=admin&retryWrites=true");

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

// Percorsi per gestire le richieste 

app.get('/', function (req, res) {
  res.send('You are in the main route!');
});

app.use('/api/v1/classes', classesRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/assignments', assignmentsRoute);
app.use('/api/v1/deliveries', deliveriesRoute);


// Server in ascolto sulla porta ...
app.listen(port, function () {
  console.log('Server running on port ', port);
});