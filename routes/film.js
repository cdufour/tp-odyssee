const Film = require('../models/film');

module.exports = (app) => {
    app.get('/films', (req, res) => {
        Film.find({}).then(films => res.send(films))
    })

    app.post('/films', (req, res) => {
        var film = new Film(req.body.film);
        film.save().then(result => res.send(result._id));
    })
}