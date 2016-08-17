var React = require('react');
var Router = require('react-router');

var helpers = require('../../utls/helpers');

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

		if(!this.props.results.hasOwnProperty('docs')){
			return(
					<li className="list-group-item">

						<h3>
							<span><em>Enter search terms to begin...</em></span>
						</h3>

					</li>
				)
		}

		else {

			var results = this.props.results.docs.map(function(product, index){
				return(
					<div key={index}
						<li className="list-group-item" >
							<h3>
								<span><em>{article.headling.main}</em></span>
								<span className="btn-group pull-right" >
									<a href={article.web_url} target="_blank"><button className="btn btn-default">View Product</button></a>
								</span>
							</h3>
						</li>
					</div>
				)
			}.bind(this));
		}

	}

})