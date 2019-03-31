import express from "express";
import passport from "passport";
import models from "../db/models";
const tokenAuth = passport.authenticate("jwt", { session: false });
const User = models.User;

// instantiate a router (mini app that only handles routes)
const router = express.Router();


// Get all stories 
router.get("/stories", tokenAuth, (req, res, next) => {
  // start a promise chain, so that any errors will pass to `handle`
  models.Story.findAll()
    .then(stories => {
      res.status(202).json({ stories: stories })
    })
    .catch(e => console.log(e));
});

// Get a story by its ID 
router.get("/story/:id", tokenAuth, (req, res) => {
  models.Story.findByPk(req.params.id).then(story => {
    res.status(200).json({ story: story });
  })
    .catch(e => console.log(e));
});

// // MVP 2 
// router.get('/user/:id/stories', (req, res) => {
//   models.User.findByPk(req.params.id, { include: [{ model: models.Story, }] }).then(user => {
//     // when calling one person by id --> an object of that perosn will show ; when using include: [{ model: Article }] --> the articles related to that peron appears
//     res.status(200).json({ user: user })
//   }).catch(e => console.log(e));

// });

// Post a new Story 
router.post("/story", (req, res) => {
  models.Story.create(req.body)
    .then(story => {
      res.status(201).json(({ story: story }))
    })
    .catch(e => console.log(e));
});

// Edit an existing story 
router.put('/story/:id', (req, res) => {
  models.Story.findByPk(req.params.id)
    .then(story => {
      story.update({
        title: req.body.title,
        body: req.body.body
      }).then(story => {
        res.status(200).json({ story: story });
      })
    }).catch(e => console.log(e))
    .catch(e => console.log(e));
});

// Delete an existing article 
router.delete('/story/:id', (req, res) => {
  models.Story.findByPk(req.params.id)
    .then(story => {
      story.destroy().then(() => {
        res.status(200).json({
          result: ` Story ID ${req.params.id} has been deleted`,
          success: true
        });
      })
        .catch(e => console.log(e));
    })
    .catch(e => console.log(e));
});

export default router;
