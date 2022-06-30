var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    firstname: String,
    name: String,
    email: String,
    password: String,
})

var UserModel = mongoose.model('users', UserSchema)

module.exports = UserModel