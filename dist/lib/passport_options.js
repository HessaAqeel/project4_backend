"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.localOptions = exports.jwtOptions = undefined;

var _dotenv = require("dotenv");

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config(); // storing JWT as a cookie and using HTTPS for all web transactions.
// never store JWT in LocalStorage malicious attackers will not be able to
// steal our user’s JWT using XSS.
var jwtOptions = exports.jwtOptions = {
  jwtFromRequest: function jwtFromRequest(req) {
    return req.cookies.jwt;
  },
  secretOrKey: process.env.PASS_KEY
};

var localOptions = exports.localOptions = {
  usernameField: "email",
  passwordField: "password"
};