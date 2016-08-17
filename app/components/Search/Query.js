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
		this.props.updateSearch(this.state.search, this.state.brand)
	}
})