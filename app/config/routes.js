var React = require('react');

var Router = require('react-router');
var Route = Router.Route;

var IndexRoute = Router.IndexRoute;

//high level React Components
var Main = require('../components/Main');
var Query = require('../components/Query');
var Results = require('../components/Results');


module.exports = (
	<Route path='/' component={Main}>
		<Route path='Query' component={Query} />
		<Route path='Results' component={Results} />

		<IndexRoute component={Query} />
	</Route>
);