var express = require("express");
var path = require("path");
var request = require('request');
var bodyParser = require('body-parser');
var compression = require('compression');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression());

app.use('/public', express.static(__dirname + '/'));
app.use('/scripts', express.static(__dirname + '/node_modules'));

app.get('/', function (req,res){
	res.sendFile(path.join(__dirname+'/index.html'));
});


 app.listen(8000);
//app.listen(80);
