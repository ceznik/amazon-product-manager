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
var PORT = process.env.PORT||3030;

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


var options = {};
var asinResult = "";
options = {SearchIndex: "Automotive", Keywords: "3D MAXpider"};
aws.call("ItemSearch", options, function(err, result) {
	if (err) throw err;
	if (result.Items.TotalResults == '0'){
		asinResult = "NO PRODUCT MATCH";
	}
	else {
		asinResult = result.Items;
	}
	console.log("Total Results: ", result.Items.Item.length);
	//console.log(result.Items);
});