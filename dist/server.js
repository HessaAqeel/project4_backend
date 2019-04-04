"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dotenv = require("dotenv");

var _dotenv2 = _interopRequireDefault(_dotenv);

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cors = require("cors");

var _cors2 = _interopRequireDefault(_cors);

var _cookieParser = require("cookie-parser");

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _error_handler = require("./lib/error_handler");

var _error_handler2 = _interopRequireDefault(_error_handler);

var _passport_startegy = require("./lib/passport_startegy");

var _passport_startegy2 = _interopRequireDefault(_passport_startegy);

var _story = require("./routes/story");

var _story2 = _interopRequireDefault(_story);

var _user_routes = require("./routes/user_routes");

var _user_routes2 = _interopRequireDefault(_user_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

// Import necessary NPM packages
// loads environment variables from a .env file into process.env
// cors let server accept the client request
//  error handling middleware
// passport authentication middleware

// *Here we import the routes and use it down there 
// Import routes files


// instantiate express application object
var app = (0, _express2.default)();

// set CORS headers on response from this API using the `cors` NPM package
// `CLIENT_ORIGIN` is an environment variable that will be set on Heroku
// accept any req from lh 3000
app.use((0, _cors2.default)({ origin: process.env.CLIENT_ORIGIN, credentials: true }));

// define port for API to run on
var port = process.env.PORT;

/* The method `.use` sets up middleware for the Express application */

// register passport authentication middleware
app.use(_passport_startegy2.default);

// add `bodyParser` middleware which will parse JSON requests into
// JS objects before they reach the route files.
app.use(_bodyParser2.default.json());

// Parse Cookie header and populate req.cookies
app.use((0, _cookieParser2.default)());

// this parses requests sent by `fetch`, which use a different content type
app.use(_bodyParser2.default.urlencoded({ extended: true }));

// register route files
app.use(_story2.default);
app.use(_user_routes2.default);

// This has to be the last thing 
// register error handling middleware
// note that this comes after the route middlewares, because it needs to be
// passed any error messages from them
app.use(_error_handler2.default);

// run API on designated port (4741 in this case)
app.listen(port, function () {
  console.log("listening on port " + port);
});

// needed for testing
exports.default = app;