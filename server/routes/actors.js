const Actor = require('../models/actor')

module.exports = {
    // READ
    getActors: (req, res) => {
        Actor.find()
            .then(actors => res.send(actors))
            .catch(e => res.status(500).send());
    },
    getActor: (req, res) => {
        Actor.findById(req.params.id)
            .then(actor => res.send(actor))
            .catch(e => res.status(500).send());
    },

    // CREATE
    createActor: async (req, res) => {
        const actorFound = await Actor.find({ name: req.body.name });
        if (actorFound.length !== 0)
            res.status(404).send("Actor Name Exists");
        else {
            const actor = new Actor(req.body);
            actor.save().then(actor => {
                res.status(201).send("Actor " + actor.name + " saved successfully!")
            }).catch((e) => {
                res.status(400).send(e)
            });
        }
    }
}