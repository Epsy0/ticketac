var mongoose = require('mongoose');

var JourneySchema = mongoose.Schema({
    departure: String,
    arrival: String,
    date: Date,
    departureTime: String,
    price:  Number
})

var journeyModel = mongoose.model('journeys', JourneySchema)

module.exports = journeyModel