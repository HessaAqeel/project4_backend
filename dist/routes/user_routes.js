"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _passport = require("passport");

var _passport2 = _interopRequireDefault(_passport);

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _custom_errors = require("../lib/custom_errors");

var _models = require("./../db/models");

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// pull in error types and the logic to handle them and set status codes
var tokenAuth = _passport2.default.authenticate("jwt", { session: false });
var localAuth = _passport2.default.authenticate("local", { session: false });
var User = _models2.default.User;

// instantiate a router (mini app that only handles routes)
var router = _express2.default.Router();

router.post("/sign-up", function (req, res, next) {
  // start a promise chain, so that any errors will pass to `handle`
  Promise.resolve(req.body.credentials).then(function (credentials) {
    if (!credentials || !credentials.password || credentials.password !== credentials.password_confirmation) {
      throw (0, _custom_errors.requireOwnership)();
    } else {
      return User.create({
        email: credentials.email,
        hashedPassword: credentials.password
      });
    }
  }).then(function (user) {
    var payload = {
      id: user.id,
      email: user.email,
      expires: process.env.JWT_EXPIRATION_D + "d"
    };

    // assigns payload to req.user
    req.login(payload, { session: false }, function (error) {
      if (error) {
        next();
      }

      // generate a signed json web token and return it in the response
      var token = _jsonwebtoken2.default.sign(JSON.stringify(payload), process.env.PASS_KEY);

      // assign our jwt to the cookie
      res.cookie("jwt", token, { httpOnly: true, secure: false }).status(201).json({ id: req.user.id, email: req.user.email });
    });
  })
  // pass any errors along to the error handler
  .catch(function (e) {
    return next();
  });
});

router.post("/sign-in", localAuth, function (req, res, next) {
  if (req.user) {
    // This is what ends up in our JWT
    var payload = {
      id: req.user.id,
      email: req.user.email,
      expires: process.env.JWT_EXPIRATION_D + "d"
    };

    // assigns payload to req.user
    req.login(payload, { session: false }, function (error) {
      if (error) {
        next();
      }

      // generate a signed json web token and return it in the response
      var token = _jsonwebtoken2.default.sign(JSON.stringify(payload), process.env.PASS_KEY);

      // assign our jwt to the cookie
      res.cookie("jwt", token, { httpOnly: true, secure: false }).status(200).json({ id: req.user.id, email: req.user.email });
    });
  }
});

router.patch("/change-password", tokenAuth, function (req, res, next) {
  if (!req.body.passwords.new) throw new BadParamsError();

  User.findOne({
    where: {
      email: req.user.email
    }
  }).then(function (user) {
    if (user != null) {
      if (user.validPassword(req.body.passwords.old)) {
        user.bcrypt(req.body.passwords.new);

        res.status(200).json({ msg: "success" });
      } else {
        throw new BadParamsError();
      }
    } else {
      throw new BadParamsError();
    }
  }).catch(function (e) {
    return next();
  });
});

exports.default = router;