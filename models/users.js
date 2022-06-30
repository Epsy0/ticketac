var mongoose = require('mongoose');

var tripSchema = mongoose.Schema({
    departure: String,
    arrival: String,
    date: Date,
    departureTime: String,
    price: Number
  });

var UserSchema = mongoose.Schema({
    firstname: String,
    name: String,
    email: String,
    password: String,
    trips: [ tripSchema ] 
})

var UserModel = mongoose.model('users', UserSchema)

module.exports = UserModel