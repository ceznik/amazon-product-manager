var React = require('react');
var Router = require('react-router');

// var helpers = require('../../utils/helpers');

var Results = React.createClass({

	getInitialState: function(){
		return{
			title: "",
			url: "",
			ASIN: ""
		}
	},

	handleClick: function(item, event){
		console.log("CLICKED");
		console.log(item);

		//additional logid can go here for what happens when you click on a product.
	},

	render: function(){

		return(
				<li className="list-group-item">

					<h3>
						<span><em>Enter search terms to begin...</em></span>
					</h3>

				</li>
			)
	}

})