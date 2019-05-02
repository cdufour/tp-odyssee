const mongoose  = require('mongoose');
const Schema  = mongoose.Schema;

const FilmSchema = new Schema({
    title: String,
    director: String,
    actors: [{lastname: String, firstname: String, _id: false}],
    duration: Number, // en minutes
    year: Number,
    country: String
})

const Film = mongoose.model('film', FilmSchema);
module.exports = Film;