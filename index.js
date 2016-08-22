//======================================
//DEPENDENCIES
//Node packages
//======================================

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var AWS = require('aws-lib');
//var amazonKeyAccess = require('./app/connection/amazon.js');
var Table = require('cli-table');
//var csvParser = require('csv-parse');
var fs = require('fs');

// fs.readFile('data/3D MAXpider Amazon Format.txt', 'utf8', function(err, data){
// 	if (err) throw err;
// 	console.log(data);
// });
//======================================
//EXPRESS CONFIGURATION
//
//======================================

var app = express();
var PORT = process.env.PORT||3030;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:'application/vnd.api+json'}));


// LISTENER
app.listen(PORT, function(){
	console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

//=======================================
//Command Line Interfact Table 
//
//=======================================
//use for displaying query data to the console
var table = new Table({
	head: ['#', 'Product', 'ASIN'],
	colWidths: [5, 45, 15]
});



//=======================================
//AMAZON CLIENT
//
//=======================================

//var aws = AWS.createProdAdvClient(amazonKeyAccess.accessKeyId,amazonKeyAccess.secretAccessKey,amazonKeyAccess.associateTag);
var aws = AWS.createProdAdvClient("AKIAI5XYHJDZZBGPFWRA","UGpxEAKSiL+GR3MvoPPskQo259J4uyneHA6OZDHD","ultrarev-20");

var productTerm = ["3D MAXpider 1781-A","3D MAXpider L1AC00001501","3D MAXpider L1AD03311509","3D MAXpider M1TY0891309","3D MAXpider M1VW0211301"];

function amazonSearch(searchTerm){
	var asinResult = "";
	
}


app.get('/search/:name?', function(req, res){
	var term = req.params.name;
	var options = {SearchIndex: "Automotive", Keywords: term, ResponseGroup: "ItemIds"};
	var searchResults = [];
	aws.call("ItemSearch",options, function(err, result){
		// res.send(result.Items.TotalResults);
		if (err) throw err;
		if (result.Items.TotalResults == "0"){
			res.send("No Results");
		}
		else if (result.Items.TotalResults == "1"){
			res.send(result.Items.Item.ASIN);
		}
		else{
			res.send(result.Items.Item[0].ASIN);
		}
	});
});

app.use('/', function(req, res){
	res.sendFile(path.join(__dirname + '/public/index.html'));
});
