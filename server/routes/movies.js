const { ObjectId } = require('mongodb');
const Movie = require('../models/movie')

const reverseDate = (date) => {
    // Reverse date format from 'YYYY-MM-DD' to 'DD-MM-YYYY'
    return date.split('-').reverse().join('-');
  }
  
module.exports = {
    //READ
    getMovie: (req, res) => {
        Movie.findOne({ id: req.params.id }).then(movie => {
            if (movie)
                res.status(200).send(movie);
            else
                res.status(500).send("Movie was not found");
        })
    },
    getMovies: (req, res) => {
        Movie.find()
            .then(movies => {
                movies.sort((a, b) => new Date(reverseDate(b.date)) - new Date(reverseDate(a.date)));
                res.send(movies);
            })
            .catch(e => res.status(500).send());
    },

    // CREATE
    createMovie: (req, res) => {
        const movie = new Movie(req.body);
        movie.save().then(movie => {
            res.status(201).send("Movie " + movie.name + " saved successfully!")
        }).catch((e) => {
            res.status(400).send(e)
        });
    },

    // UPDATE
    updateMovie: (req, res) => {
        Movie.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body }, { new: false, runValidators: true }).then(movie => {
            if (!movie) {
                return res.status(404).send("Movie ID was not found")
            }
            else {
                res.status(200).send("Movie updated successfully")
            }
        }).catch(e => res.status(400).send(e))
    },
    AddActorToMovie: async (req, res) => {
        //Movie Check
        Movie.findById(req.params.movieID, (error, result) => {
            if (error)
                res.status(500).send("Error");
            else if (result) {
                let actorsArr = result.actors;
                if (actorsArr)
                    Movie.findOne({ _id: req.params.movieID, actors: ObjectId(req.params.actorID) }).then((exists) => {
                        if (exists)
                            res.status(500).send("Actor already in movie cast");
                        else {
                            actorsArr.push(req.params.actorID);
                            Movie.updateOne({ _id: req.params.movieID }, { actors: actorsArr }).then(() => {
                                res.status(200).send("Actor added successfully");
                            });
                        }
                    })
            }
            if (!result)
                res.sendStatus(404).send("Wrong Movie ID");
        })
    },

    // DELETE
    deleteMovie: function (req, res) {
        Movie.findByIdAndDelete(req.params.id).then((result) => {
            if (result)
                res.status(200).send("Delete success");
            else
                res.status(500).send("Movie ID not found");
        }, (error) => {
            res.status(404);
        })
    },

    deleteActorFromMovie: function (req, res) {
        Movie.findById(req.params.movieID, (error, result) => {
            if (error)
                res.status(500).send("Error");
            else if (result) {
                let actorsArr = result.actors;
                if (actorsArr)
                    Movie.findOne({ _id: req.params.movieID, actors: ObjectId(req.params.actorID) }).then((exists) => {
                        if (exists) {
                            actorsArr = actorsArr.filter((act) => {
                                return !act.equals(req.params.actorID);
                            });
                            Movie.updateOne({ _id: req.params.movieID }, { actors: actorsArr }).then(() => {
                                res.status(200).send("Actor removed successfully");
                            });
                        }
                        else {
                            res.status(500).send("Can't find actor the cast of the movie.");
                        }
                    })
            }
            if (!result)
                res.sendStatus(404).send("Wrong Movie ID");
        })
    }
};