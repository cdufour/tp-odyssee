const moment = require('moment');
const Film = require('../models/film');
const Session = require('../models/session');

const getFilmDuration = async (filmId) => {
    var {duration} = 
        await Film.findOne({ _id: filmId}, { duration: 1, _id: 0 });
    return duration;    
};

const getSessionsByDayAndRoom = async (day, room) => {
    var sessions = null;
    var dateBase = moment(day).format('YYYY-MM-DD') + 'T';
    var start = dateBase + '10:00';
    var end = dateBase + '22:00';

    sessions = await Session
        .find({ datetime: { $gte: start, $lte: end }, room: room })
        .populate({ path: 'film', model: Film })

    return sessions;
}

const buildTimeSlots = (sessions) => {
    var timeSlots = [];
    var start, end;

    sessions.forEach(s => {
        start = moment(s.datetime);
        end = moment(s.datetime).add(s.film.duration, 'm');
        timeSlots.push({start, end});
    })

    return timeSlots;
}

const isTimeSlotAllowed = (timeSlot, timeSlots) => {
    var allowed = true;

    // itére sur le tableau des plages horaires
    for(var i=0; i<timeSlots.length; i++) {
        // ma séance doit démarrer après une séance déjà programmée
        var cond1 = timeSlot.start > timeSlots[i].end;
        // ma séance doit finir avant une séance déjà programmée
        var cond2 = timeSlot.end < timeSlots[i].start;

        // si aucune des deux possibilités de l'alternative ne vaut vraie
        // la plage horaire requise est déjà prise
        if (!(cond1 || cond2)) {
            allowed = false;
            break;
        }
    }

    return allowed;
}

module.exports = {
    getFilmDuration,
    getSessionsByDayAndRoom,
    buildTimeSlots,
    isTimeSlotAllowed
}