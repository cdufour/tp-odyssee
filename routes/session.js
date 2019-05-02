const Session = require('../models/session');
const Film = require('../models/film');
const moment = require('moment');
const { 
    getFilmDuration, 
    getSessionsByDayAndRoom,
    buildTimeSlots,
    isTimeSlotAllowed
} = require('../utils/helpers');

module.exports = (app) => {
    app.get('/sessions', (req, res) => {
        var start = null;
        var end = null;
        var condition = {};

        if (req.query.start) {
            start = req.query.start + 'T10:00';
        }
        if (req.query.end) {
            end = req.query.end + 'T22:00';
        }

        if (start && end) { // début et fin sont donnés
            condition = {
                $and: [
                   { datetime: { $gte: start } },
                   { datetime: { $lte: end } }
                ]
            }
        } else if (start && !end) { // seul le début est donné
            condition = { datetime: { $gte: start } }
        } else if (!start && end) { // seule la fin est donnée
            condition = { datetime: { $lte: end } }
        }


        Session.find(condition)
            //.populate({ path: 'film', model: Film })
            .then(sessions => {
                if (sessions.length == 0) {
                    res.send('SESSION_SEARCH_ZERO_RESULT')
                } else {
                    res.send(sessions);
                }
            })
            .catch(err => {
                res.send('SESSION_SEARCH_PROBLEM')
            })
    })

    app.post('/sessions', async (req, res) => {
        var {session} = req.body;
        //1. récupérer la durée du film identifié
        var duration = await getFilmDuration(session.film);

        //2. création de la plage horaire pour le film identifié
        var timeSlot = {
            start: moment(session.datetime),
            end: moment(session.datetime).add(duration, 'm')
        };

        //3. connaître les séances déjà programmmées le même jour/même salle
        var sessions = 
            await getSessionsByDayAndRoom(session.datetime, session.room);
        
        if (sessions.length == 0) { // aucune séance enregistrée ce jour-là pour cette salle-là
            var newSession = new Session(session);
            newSession.save().then(result => {
                res.send(result._id);
            })
        } else {
            console.log('séances déjà enregistrée même jour/salle');
            
            // 4. Construction des plages horaires
            var timeSlots = buildTimeSlots(sessions);
            
            // 5. Déterminer si la plage horaire souhaitée est permise
            var allowed = isTimeSlotAllowed(timeSlot, timeSlots);
            console.log({allowed})
            if (allowed) {
                var newSession = new Session(session);
                newSession.save().then(result => {
                    res.send(result._id);
                })
            } else { // plage horaire déjà occupée
                res.send('TIMESLOT_NOT_ALLOWED');
            }
        }
        
    })
}