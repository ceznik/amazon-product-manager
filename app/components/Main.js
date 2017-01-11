var React = require('react');
var Router = require('react-router');


var Main = React.createClass({

	render:function(){
		return(
			<div className="main-container">
				<div className="jumbotron">
					<h2 className="text-center"><strong>(ReactJS) Amazon Product Search Tool</strong></h2>
					<h3 className="text-center">Search and List Amazon Products for Sale</h3>
				</div>

				{this.props.children}

				<footer>
					<hr />
					<p className="pull-right"><i className="fa fa-github" aria-hidden="true"></i>Proudly built using React.js</p>
				</footer>
			</div>
		)
	}

});

module.exports = Main;