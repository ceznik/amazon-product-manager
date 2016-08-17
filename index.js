//======================================
//DEPENDENCIES
//Node packages
//======================================

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var AWS = require('aws-lib');
var amazonKeyAccess = require('./app/connection/amazon.js');
var Table = require('cli-table');

//======================================
//EXPRESS CONFIGURATION
//
//======================================

var app = express();
var PORT = process.env.PORT||3031;

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

var aws = AWS.createProdAdvClient(amazonKeyAccess.accessKeyId,amazonKeyAccess.secretAccessKey,amazonKeyAccess.associateTag);

var productTerm = ["3D MAXpider 1781-A","3D MAXpider L1AC00001501","3D MAXpider L1AD03311509","3D MAXpider M1TY0891309","3D MAXpider M1VW0211301"];

function amazonSearch(searchTerm){
	var asinResult = "";
	var options = {SearchIndex: "Automotive", Keywords: "3D MAXpider"};
	aws.call("ItemSearch", options, function(err, result) {
		if (err) throw err;
		if (result.Items.TotalResults == '0'){
			asinResult = "NO PRODUCT MATCH";
		}
		else {
			asinResult = result.Items;
		}
		return result;
	});
}

app.get('/:name', function(req, res){
	var term = req.params.name;
	var options = {SearchIndex: "Automotive", Keywords: term};
	var searchResults = [];
	aws.call("ItemSearch",options, function(err, result){
		for (var i = 0; i < result.Items.Item.length; i++){
			searchResults.push([result.Items.Item[i].ASIN,result.Items.Item[i].DetailPageURL, result.Items.Item[i].ItemAttributes.Manufacturer,result.Items.Item[i].ItemAttributes.Title]);
		}
		res.send(searchResults);
	});
});

app.get('/', function(req, res){
	res.send("searchResults");
});
