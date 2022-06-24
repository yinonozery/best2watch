const mongoose = require('mongoose');
const id_validator = require('mongoose-id-validator');

var MovieSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    picture: { type: String, required: true },
    director: { type: String, required: true },
    date: { type: String, required: true },
    rating: { type: Number, required: true },
    isSeries: { type: Boolean, required: true },
    series_details: [{ type: Number, required: false }],
    actors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'actors', required: false }]
},
    { versionKey: false },
);

MovieSchema.plugin(id_validator);

const Movie = mongoose.model('movies', MovieSchema);

module.exports = Movie;