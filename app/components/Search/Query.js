var React = require('react');

var Query = React.createClass({
	getInitialState: function(){
		return {
			search: "",
			brand: "",
			part-num: ""
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
				<div className="row">
					<div className="col-lg-12">

						<div className="panel panel-primary">
							<div className="panel-heading">
								<h1 className="panel-title"><strong><i className="fa fa-newspaper-o" aria-hidden="true"></i>Query</strong></h1>
							</div>
							<div className="panel-body">

								<form>
									<div className="form-group">
										<h4 className=""><strong>Search</strong></h4>
										<input type="text" value={this.state.value} className="form-control" id="search" onChange={this.handleChange} required/>

										<h4 className=""><strong>Manufacturer</strong></h4>
										<input type="text" value={this.state.value} className="form-control" id="manufacturer" onChange={this.handleChange} required/>

										<h4 className=""><strong>Part Number</strong></h4>
										<input type="text" value={this.state.value} className="form-control" id="partnumer" onChange={this.handleChange} required/>
									</div>

									<div className="pull-right">
										<button type="button" className="btn btn-danger" onClick={this.handleSubmit}><h4>Search</h4></button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
});

module.exports = Query;

