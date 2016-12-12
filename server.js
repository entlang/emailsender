var express = require('express');
var router = express.Router();

var methodOverride = require('method-override');
var bodyParser = require("body-parser");
var path = require('path');

var app = express();

app.use(methodOverride());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//CORS
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}
app.use(allowCrossDomain);

app.use(express.static("dist"));
app.use('/', require('./server/emailsender'));

app.listen(3000, function () {
  console.log('Server is listening on port 3000. Ready to accept requests!');
});

