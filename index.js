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

var aws = AWS.createProdAdvClient(amazonKeyAccess.accessKeyId,amazonKeyAccess.secretAccessKey,amazonKeyAccess.associateTag);

//test data
//var productTerm = ["3D MAXpider 1781-A","3D MAXpider L1AC00001501","3D MAXpider L1AD03311509","3D MAXpider M1TY0891309","3D MAXpider M1VW0211301"];

// function amazonSearch(searchTerm){
// 	var asinResult = "";
	
// }


app.get('/search/:mfr/:partnum', function(req, res){
	var term = req.params.mfr.toLowerCase() + "+" + req.params.partnum;
	var options = {SearchIndex: "Automotive", Keywords: term, ResponseGroup: "ItemIds,ItemAttributes"};
	aws.call("ItemSearch",options, function(err, result){
		// res.send(result.Items.TotalResults);
		if (err) throw err;
		console.log(term);
		//console.log(result);
		if (parseInt(result.Items.TotalResults) == 0){
			res.send("No Results");
		}
		else if (parseInt(result.Items.TotalResults) == 1){
			res.send(result.Items.Item.ASIN);
		}
		else if(parseInt(result.Items.TotalResults) >= 2){
			var multiple = [];
			for(var i = 0; i < result.Items.Item.length; i++){
				//console.log(result.Items.Item[i].ItemAttributes.Manufacturer.toLowerCase());
				//console.log(result.Items.Item[i].ItemAttributes.MPN);
				if(result.Items.Item[i].ItemAttributes.Brand.toLowerCase() == req.params.mfr.toLowerCase() && result.Items.Item[i].ItemAttributes.Model == req.params.partnum){				
					multiple.push({Mfr:result.Items.Item[i].ItemAttributes.Manufacturer,Mpn:result.Items.Item[i].ItemAttributes.MPN, Asin:result.Items.Item[i].ASIN, Upc:result.Items.Item[i].ItemAttributes.UPC});
					asinResult = result.Items.Item[i].ASIN;
				}
			}
			console.log(multiple.length == 0);
			if(multiple.length !== 0){
				res.send(multiple[0].Asin);
			}
			else{
				res.send("Product Not Found");
			}
		}
		else{
			res.send("Unknown Error");
		}
	});
});

app.get('/response/:name', function(req, res){
	var term = req.params.name;
	var options = {SearchIndex: "Automotive", Keywords: term, ResponseGroup: "ItemIds,ItemAttributes,SalesRank", Sort:"salesrank"};
	aws.call("ItemSearch",options, function(err, result){
		if (err) throw err;
		res.send(result);
	});
});

app.use('/', function(req, res){
	res.sendFile(path.join(__dirname + '/public/index.html'));
});
