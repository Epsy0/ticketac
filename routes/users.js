var express = require('express');
var router = express.Router();
var UserModel = require('../models/users')

// SIGN UP ON LOGIN PAGE
router.get("/logout", function (req, res, next) {
  req.session.user = null;
  req.session.journey = [];
  res.redirect("/login");
});

router.post("/sign-up", async function (req, res, next) {
  // Create a new user
  var newUser = new UserModel({
    firstname: req.body.firstname,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  // Check if user already exists
  if (await UserModel.findOne({ email: req.body.email })) {
    res.redirect("/login");
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
    res.redirect("/login");
  }
});

module.exports = router;
