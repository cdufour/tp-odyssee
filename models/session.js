const mongoose  = require('mongoose');
const Schema  = mongoose.Schema;

const SessionSchema = new Schema({
    datetime: Date,
    film: {type: mongoose.Schema.Types.ObjectId, ref: 'Film'},
    room: Number
})

const Session = mongoose.model('session', SessionSchema);
module.exports = Session;