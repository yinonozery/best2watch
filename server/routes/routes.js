const express = require('express'),
    movieRoutes = require('./movies'),
    actorRoutes = require('./actors');
var router = express.Router();

// Movies
router.get('/movie/:id', movieRoutes.getMovie);
router.get('/movies', movieRoutes.getMovies);

router.post('/movies/', movieRoutes.createMovie);

router.put('/movie/:movieID/actor/:actorID', movieRoutes.AddActorToMovie);
router.put('/movie/:id/', movieRoutes.updateMovie);

router.delete('/movie/:id', movieRoutes.deleteMovie);

// Actors
router.get('/actors', actorRoutes.getActors);
router.get('/actor/:id', actorRoutes.getActor);

router.put('/actor/', actorRoutes.createActor);

router.delete('/movie/:movieID/actor/:actorID', movieRoutes.deleteActorFromMovie);


module.exports = router;