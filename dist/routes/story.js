"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _passport = require("passport");

var _passport2 = _interopRequireDefault(_passport);

var _models = require("../db/models");

var _models2 = _interopRequireDefault(_models);

var _custom_errors = require("../lib/custom_errors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tokenAuth = _passport2.default.authenticate("jwt", { session: false });
var User = _models2.default.User;


// instantiate a router (mini app that only handles routes)
var router = _express2.default.Router();

// Get all stories 
router.get("/stories", function (req, res, next) {
  // start a promise chain, so that any errors will pass to `handle`
  _models2.default.Story.findAll().then(function (stories) {
    res.status(202).json({ stories: stories });
  }).catch(function (e) {
    return console.log(e);
  });
});

// Get a story by its ID 
router.get("/story/:id", function (req, res) {
  _models2.default.Story.findByPk(req.params.id).then(function (story) {
    res.status(200).json({ story: story });
  }).catch(function (e) {
    return console.log(e);
  });
});

// Post a new Story 
router.post("/story", tokenAuth, function (req, res) {
  _models2.default.Story.create(req.body).then(function (story) {
    res.status(201).json({ story: story });
  }).catch(function (e) {
    return console.log(e);
  });
});

// router.put('/story/:id', (req, res) => {
//   models.Story.findByPk(req.params.id)
//     .then(story => {
//       story.update({
//         title: req.body.title,
//         body: req.body.body
//       }).then(story => {
//         res.status(200).json({ story: story });
//       })
//     }).catch(e => console.log(e))
//     .catch(e => console.log(e));
// });


// Edit an existing story / only with an authorized user 

router.put('/story/:id', tokenAuth, function (req, res, next) {
  _models2.default.Story.findByPk(req.params.id).then(function (story) {
    if (story) {
      console.log(story.get({ plain: true }));
      if (story.author === req.user.id) {
        return story.update({
          title: req.body.story.title,
          body: req.body.story.body
        });
      } else {
        throw new _custom_errors.OwnershipError();
      }
    }
  }).then(function (story) {
    res.status(200).json({ story: story });
  }).catch(function (e) {
    return console.log(e);
  });
});

// Delete an existing article / only the user with the same Id is able to do so 
router.delete('/story/:id', tokenAuth, function (req, res, next) {

  _models2.default.Story.findByPk(req.params.id).then(function (story) {

    if (story) {
      console.log(story.get({ plain: true }));
      if (story.author === req.user.id) {
        return story.destroy();
      } else {
        throw new _custom_errors.OwnershipError();
      }
    }
  }).then(function () {
    res.status(200).json({
      result: " Story ID " + req.params.id + " has been deleted",
      success: true
    });
  }).catch(function (e) {
    return next();
  });
});

// Get all stories posted by one user 
router.get('/user/:id/stories', function (req, res) {
  _models2.default.User.findByPk(req.params.id, { include: [{ model: _models2.default.Story, as: "stories" }] }).then(function (user) {
    // when calling one person by id --> an object of that perosn will show ; when using include: [{ model: Article }] --> the articles related to that peron appears
    res.status(200).json({ stories: user.stories });
  }).catch(function (e) {
    return console.log(e);
  });
});

exports.default = router;