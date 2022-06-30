var express = require('express');
var router = express.Router();
var UserModel = require('../models/users')

/* GET users listing. */
// SIGN UP ON LOGIN PAGE
router.post("/sign-up", async function (req, res, next) {
  // Create a new collection user
  var newUser = new UserModel({
    firstname: req.body.firstname,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  // Check if user already exists
  if (await UserModel.findOne({ email: req.body.email })) {
    res.redirect("/");
  } else {
    // Push new user
    var newUserSave = await newUser.save();
    // Create a session for this user
    req.session.user = {
      username: newUserSave.username,
      id: newUserSave._id,
    };

    res.redirect("/homepage");
  }
});

// SIGN IN ON LOGIN PAGE
router.post("/sign-in", async function (req, res, next) {
  // Post login infos
  var newUser = { email: req.body.email, password: req.body.password };
  // Check if email & password are valid
  if (
    await UserModel.findOne({
      email: newUser.email,
      password: newUser.password,
    })
  ) {
    // Create session for this user
    var userLog = await UserModel.findOne({ email: req.body.email });
    req.session.user = {
      username: userLog.username,
      id: userLog._id,
    };
    res.redirect("/homepage");
  } else {
    res.redirect("/");
  }
});

module.exports = router;
