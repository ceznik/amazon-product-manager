//======================================
//DEPENDENCIES
//Node packages
//======================================

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var amazon = require('amazon-product-api');

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
//AMAZON CLIENT
//
//=======================================

var client = amazon.createClient({
	awsId: "AKIAJIF67OFDJPEVJRFQ",
	awsSecret: "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",
	awsTag: "A1MAHQ3DXWNQOA",
});

client.itemSearch({
	director: 'Quentin Tarantino',
	actor: 'Samuel L. Jackson',
	searchIndex: 'DVD',
	audienceRating: 'R',
	responseGroup: 'ItemAttributes,Offers,Images'
}).then(function(results){
	console.log(results);
}).catch(function(err){
	console.log(err.Error[0].Message);
});

