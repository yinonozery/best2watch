const mongoose = require('mongoose')

var ActorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    picture: { type: String, required: true, trim: true },
    site: { type: String, required: true, trim: true }
},
    { versionKey: false },
);


const Actor = mongoose.model('actors', ActorSchema);

module.exports = Actor;