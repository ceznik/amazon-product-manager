var React = require('react');

var Router = require('react-router');
var Route = Router.Route;

var IndexRoute = Router.IndexRoute;

//high level React Components
var Main = require('../components/Main');
var Search = require('../components/Search');
var Results = require('../components/Results');


module.exports = (
	<Route path='/' component={Main}>
		<Route path='Search' component={Search} />
		<Route path='Resuls' component={Results} />

		<IndexRoute component={Search} />
	</Route>
);