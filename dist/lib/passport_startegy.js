"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _passportJwt = require("passport-jwt");

var _passportJwt2 = _interopRequireDefault(_passportJwt);

var _passportLocal = require("passport-local");

var _passportLocal2 = _interopRequireDefault(_passportLocal);

var _passport = require("passport");

var _passport2 = _interopRequireDefault(_passport);

var _passport_options = require("./passport_options");

var _custom_errors = require("../lib/custom_errors");

var _models = require("./../db/models");

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Passport Package
var User = _models2.default.User;

// user model will be used to set `req.user` in
// authenticated routes


var JwtStrategy = _passportJwt2.default.Strategy; // passport.authenticate('local')
var LocalStrategy = _passportLocal2.default.Strategy; // passport.authenticate('jwt'),

var localStrategy = new LocalStrategy(_passport_options.localOptions, function (email, password, next) {
  User.findOne({ where: { email: email } }).then(function (user) {
    if (user !== null) {
      if (user.validPassword(password)) {
        return next(null, user);
      } else {
        throw new _custom_errors.BadCredentialsError();
      }
    } else {
      throw new _custom_errors.BadCredentialsError();
    }
  }).catch(function (e) {
    return next(e);
  });
});

// This module lets you authenticate endpoints using a JSON web token.
// It is intended to be used to secure RESTful endpoints without sessions.
var jwtStrategy = new JwtStrategy(_passport_options.jwtOptions, function (jwtPayload, next) {
  console.log(jwtPayload.expires);
  if (Date.now() > jwtPayload.expires) {
    throw new _custom_errors.JWTExpiredError();
  } else {
    User.findOne({ where: { id: jwtPayload.id } }).then(function (user) {
      if (user !== null) {
        next(null, user);
      } else {
        next(null, false);
      }
    }).catch(function (e) {
      return next(e);
    });
  }
});

// serialize and deserialize functions are used by passport under
// the hood to determine what `req.user` should be inside routes
_passport2.default.serializeUser(function (user, done) {
  done(null, user);
});

_passport2.default.deserializeUser(function (user, done) {
  done(null, user);
});

// register this strategy with passport
_passport2.default.use(jwtStrategy);
_passport2.default.use(localStrategy);
// create a passport middleware based on all the above configuration
exports.default = _passport2.default.initialize();