var React = require('react');
var Router = require('react-router');

var Query = React.createClass({
	getInitialState: function(){
		return {
			search: ""
		}
	},

	handleChange: function(event) {
		console.log("TEXT CHANGED");


		var newState = {};
		newState[event.target.id] = event.target.value;
		this.setState(newState);
	},

	handleSubmit: function() {
		console.log("CLICKED");
		this.props.updateSearch(this.state.search, this.state.brand);
		return false;
	},

	render: function(){
		return(
			<div className="main-container">
				<div className="panel panel-default">
					<div className="panel-heading">
						<h3 className="panel-title text-left">Query</h3>
					</div>
					<div className="panel-body text-left">

							<form>
								<div className="form-group">
									<h4 className=""><strong>Manufacturer</strong></h4>

									{/*Note how each of the form elements has an id that matches the state. This is not necessary but it is convenient.
										Also note how each has an onChange event associated with our handleChange event. 
									*/}
									<input type="text" className="form-control text-left" id="search" onChange= {this.handleChange} required/>
									<br />
									<button type="button" className="btn btn-primary" onClick={this.handleClick}>Submit</button>
								</div>

							</form>
					</div>
				</div>
			</div>
			
			
		)
	}
});

module.exports = Query;

