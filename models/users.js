var mongoose = require('mongoose');


var UserSchema = mongoose.Schema({
    firstname: String,
    name: String,
    email: String,
    password: String,
    trips: [ {type: mongoose.Schema.Types.ObjectId, ref:'journeys'} ] 
})

var UserModel = mongoose.model('users', UserSchema)

module.exports = UserModel