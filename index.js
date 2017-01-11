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
//var asinResult = "";
	
// }



app.get('/search/:mfr/:partnum', function(req, res){
	var term = req.params.mfr.toLowerCase() + " " + req.params.partnum;
	var options = {SearchIndex: "Automotive", Keywords: term, ResponseGroup: "ItemIds,ItemAttributes,SalesRank" };
	aws.call("ItemSearch",options, function(err, result){
		// res.send(result.Items.TotalResults);
		try{

			console.log("----------------------");
			console.log("SEARCH TERM: " + term);
			//console.log(result);
			if (parseInt(result.Items.TotalResults) == 0){
				console.log("NO RESULTS");
				res.send("No Results");
			}
			else if (parseInt(result.Items.TotalResults) == 1){
				console.log("ASIN MATCH: " + result.Items.Item.ASIN);
				res.send(result.Items.Item.ASIN);
			}
			else if(parseInt(result.Items.TotalResults) >= 2){
				var multiple = [];
				console.log(result.Items.Item.length + " MATCHES FOUND....");
				for(var i = 0; i < result.Items.Item.length; i++){
					console.log(req.params.mfr.toLowerCase().replace(/\+/g," "));
					//console.log(req.params.partnum.replace(" ","-"));
					console.log("Manufacturer: " + result.Items.Item[i].ItemAttributes.Manufacturer.toLowerCase());
					console.log("Brand: " + result.Items.Item[i].ItemAttributes.Brand.toLowerCase() );
					console.log("MPN: " + result.Items.Item[i].ItemAttributes.MPN);
					console.log(result.Items.Item[i].ASIN);
					//try{
						//if()
						if(result.Items.Item[i].ItemAttributes.Manufacturer.toLowerCase() == req.params.mfr.toLowerCase().replace(/\+/g," ") && result.Items.Item[i].ItemAttributes.MPN == req.params.partnum){				
						multiple.push({Mfr:result.Items.Item[i].ItemAttributes.Manufacturer,Mpn:result.Items.Item[i].ItemAttributes.MPN, Asin:result.Items.Item[i].ASIN});
						//asinResult = result.Items.Item[i].ASIN;
					//}

					}
					// else if (result.Items.Item[i].ItemAttributes.Manufacturer.toLowerCase() == req.params.mfr.toLowerCase().replace("+"," ") && result.Items.Item[i].ItemAttributes.MPN == req.params.partnum){
					// 	multiple.push({Mfr:result.Items.Item[i].ItemAttributes.Manufacturer,Mpn:result.Items.Item[i].ItemAttributes.MPN, Asin:result.Items.Item[i].ASIN});
					// 	//asinResult = result.Items.Item[i].ASIN;
					// }
				}
				console.log(multiple);
				if(multiple.length !== 0){
					console.log("TOP RESULT: " + multiple[0].Asin);
					res.send(multiple[0].Asin);
				}
				else{
					res.send("Product Not Found");
				}
			}
			else{
				res.send("Unknown Error");
			}
		}
		catch(err){
			console.log(err);
			res.send("Some Error");
		}
	});
});

app.get('/response/:name', function(req, res){
	var term = req.params.name;
	var options = {SearchIndex: "Automotive", Keywords: term, ResponseGroup: "ItemIds,ItemAttributes,SalesRank,Images"};
	
	aws.call("ItemSearch",options, function(err, result){
		try{
			if (err || result.Items.TotalResults == 0) throw result.Items.Request.Errors.Error.Message;
			//console.log("manufacturer: " + result.Items.Item[0].ItemAttributes.Manufacturer.toLowerCase());
		}
		catch(err){
			console.log(result.Items.Request.Errors.Error.Message);
		}
		res.send(result);
	});
});

app.get('/asin/:id', function(req, res){
	var asinId = req.params.id;
	var options = {SearchIndex: "Automotive", Keywords: asinId, ResponseGroup: "ItemIds,ItemAttributes,SalesRank", Sort:"salesrank"};
	var productInfo = '<!DOCTYPE html>' +
					  '<html>' + 
					  '<head>' +
					  '</head>'+
					  '<body>' +
					  '<table>';
	productInfo += '<tr>'+
					'<th> Brand </th>' +
					'<th> Manufacturer </th>' +
					'<th> Model </th>' +
					'<th> MPN </th>' +
					'</tr>' +
					'<tr>';
	var Brand = "";
	var Manufacturer = "";
	var Model = "";
	var MPN = "";
	aws.call("ItemSearch", options, function(err, result){
		//if (err) throw err;
		try{
			if (result.Items.Item.ItemAttributes.Brand == undefined) throw "N/A";
			Brand = result.Items.Item.ItemAttributes.Brand;
		}
		catch(err){
			Brand = err;
		}
		try{
			if (result.Items.Item.ItemAttributes.Manufacturer == undefined) throw "N/A";
			Manufacturer = result.Items.Item.ItemAttributes.Manufacturer
		}
		catch(err){
			Manufacturer = err;
		}
		try{
			if (result.Items.Item.ItemAttributes.Model == undefined) throw "N/A";
			Model = result.Items.Item.ItemAttributes.Model
		}
		catch(err){
			Model = err;
		}		
		try{
			if (result.Items.Item.ItemAttributes.MPN == undefined) throw "N/A";
			MPN = result.Items.Item.ItemAttributes.MPN;
		}
		catch(err){
			MPN = err;
		}

		productInfo += '<td>' + Brand + '</td>' +
					   '<td>' + Manufacturer +'</td>' + 
					   '<td>' + Model + '</td>' + 
					   '<td>' + MPN + '</td>' +
					   '</td>' +
					   '</table>' + 
					   '</body>' +
					   '</html>';
		res.send(productInfo);
	});
});

app.get('/gencsv/:brand/:partnum', function(req, res) {
	var brand = req.params.brand.toLowerCase();
	var partnum = req.params.partnum;
	aws.call("ItemSearch",options, function(err, result){
		try{

			console.log("----------------------");
			console.log("SEARCH TERM: " + term);
			//console.log(result);
			if (parseInt(result.Items.TotalResults) == 0){
				console.log("NO RESULTS");
				res.send("No Results");
			}
			else if (parseInt(result.Items.TotalResults) == 1){
				console.log("ASIN MATCH: " + result.Items.Item.ASIN);
				res.send(result.Items.Item.ASIN);
			}
			else if(parseInt(result.Items.TotalResults) >= 2){
				var multiple = [];
				console.log(result.Items.Item.length + " MATCHES FOUND....");
				for(var i = 0; i < result.Items.Item.length; i++){
					console.log(req.params.mfr.toLowerCase().replace(/\+/g," "));
					//console.log(req.params.partnum.replace(" ","-"));
					console.log("Manufacturer: " + result.Items.Item[i].ItemAttributes.Manufacturer.toLowerCase());
					console.log("Brand: " + result.Items.Item[i].ItemAttributes.Brand.toLowerCase() );
					console.log("MPN: " + result.Items.Item[i].ItemAttributes.MPN);
					console.log(result.Items.Item[i].ASIN);
						if(result.Items.Item[i].ItemAttributes.Manufacturer.toLowerCase() == req.params.mfr.toLowerCase().replace(/\+/g," ") && result.Items.Item[i].ItemAttributes.MPN == req.params.partnum){				
						multiple.push({Mfr:result.Items.Item[i].ItemAttributes.Manufacturer,Mpn:result.Items.Item[i].ItemAttributes.MPN, Asin:result.Items.Item[i].ASIN});
						}
				}
				console.log(multiple);
				if(multiple.length !== 0){
					console.log("TOP RESULT: " + multiple[0].Asin);
					res.send(multiple[0].Asin);
				}
				else{
					res.send("Product Not Found");
				}
			}
			else{
				res.send("Unknown Error");
			}
		}
		catch(err){
			console.log(err);
			res.send("Some error");
		}
	});
});

app.get('/images/:name', function(req, res){
	var term = req.params.name;
	var options = {SearchIndex: "Automotive", Keywords: term, ResponseGroup: "ItemIds,ItemAttributes,SalesRank,Images"};
	var images = [];
	aws.call("ItemSearch",options, function(err, result){
		try{
			if (err || result.Items.TotalResults == 0) throw result.Items.Request.Errors.Error.Message;
			//console.log("manufacturer: " + result.Items.Item[0].ItemAttributes.Manufacturer.toLowerCase());
		}
		catch(err){
			console.log(result.Items.Request.Errors.Error.Message);
		}
		
		res.send(result);
	});
});

app.use('/', function(req, res){
	res.send(__dirname);
	//res.sendFile(path.join(__dirname + '/public/index.html'));
});

