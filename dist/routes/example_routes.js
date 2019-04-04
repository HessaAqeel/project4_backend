"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _passport = require("passport");

var _passport2 = _interopRequireDefault(_passport);

var _models = require("./../db/models");

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tokenAuth = _passport2.default.authenticate("jwt", { session: false });
var User = _models2.default.User;

// instantiate a router (mini app that only handles routes)
var router = _express2.default.Router();

router.get("/stories", tokenAuth, function (req, res, next) {
  // start a promise chain, so that any errors will pass to `handle`
  _models2.default.Story.findAll().then(function (stories) {
    // bring all aricles 
    res.status(202).json({ stories: stories });
  }).catch(function (e) {
    return console.log(e);
  });
});
exports.default = router;