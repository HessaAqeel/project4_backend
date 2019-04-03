import express from "express";
import passport from "passport";
import models from "../db/models";
const tokenAuth = passport.authenticate("jwt", { session: false });
const User = models.User;
import { OwnershipError } from "../lib/custom_errors";

// instantiate a router (mini app that only handles routes)
const router = express.Router();


// Get all stories 
router.get("/stories", (req, res, next) => {
  // start a promise chain, so that any errors will pass to `handle`
  models.Story.findAll()
    .then(stories => {
      res.status(202).json({ stories: stories })
    })
    .catch(e => console.log(e));
});

// Get a story by its ID 
router.get("/story/:id", (req, res) => {
  models.Story.findByPk(req.params.id).then(story => {
    res.status(200).json({ story: story });
  })
    .catch(e => console.log(e));
});



// Post a new Story 
router.post("/story", tokenAuth, (req, res) => {
  models.Story.create(req.body)
    .then(story => {
      res.status(201).json(({ story: story }))
    })
    .catch(e => console.log(e));
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

router.put('/story/:id', tokenAuth, (req, res, next) => {
  models.Story.findByPk(req.params.id)
    .then(story => {
      if (story) {
        console.log(story.get({ plain: true }))
        if (story.author === req.user.id) {
          return story.update({
            title: req.body.story.title,
            body: req.body.story.body
          })
        } else {
          throw new OwnershipError()
        }
      }
    }).then(story => {
      res.status(200).json({ story: story });
    }).catch(e => console.log(e))
})





// Delete an existing article / only the user with the same Id is able to do so 
router.delete('/story/:id', tokenAuth, (req, res, next) => {

  models.Story.findByPk(req.params.id)
    .then(story => {

      if (story) {
        console.log(story.get({ plain: true }))
        if (story.author === req.user.id) {
          return story.destroy();
        } else {
          throw new OwnershipError()
        }
      }
    })
    .then(() => {
      res.status(200).json({
        result: ` Story ID ${req.params.id} has been deleted`,
        success: true
      })
    })
    .catch(e => next());
});

// Get all stories posted by one user 
router.get('/user/:id/stories', (req, res) => {
  models.User.findByPk(req.params.id, { include: [{ model: models.Story, as: "stories" }] }).then(user => {
    // when calling one person by id --> an object of that perosn will show ; when using include: [{ model: Article }] --> the articles related to that peron appears
    res.status(200).json({ stories: user.stories })
  }).catch(e => console.log(e));

});



export default router;
