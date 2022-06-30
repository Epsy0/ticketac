var express = require('express');
var router = express.Router();
var connect = require('../models/connect')
var UserModel = require('../models/users')
var journeyModel = require('../models/journey')

var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"]
var date = ["2018-11-20","2018-11-21","2018-11-22","2018-11-23","2018-11-24"]



/* GET Sign page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

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



/* GET Home page. */
router.get('/homepage', function(req, res, next) {
  res.render('homepage');
});

router.post('/sign up', function(req, res, next) {
  res.render('homepage');
});



// Remplissage de la base de donnée, une fois suffit
router.get('/save', async function(req, res, next) {

  // How many journeys we want
  var count = 300

  // Save  ---------------------------------------------------
    for(var i = 0; i< count; i++){

    departureCity = city[Math.floor(Math.random() * Math.floor(city.length))]
    arrivalCity = city[Math.floor(Math.random() * Math.floor(city.length))]

    if(departureCity != arrivalCity){

      var newUser = new journeyModel ({
        departure: departureCity , 
        arrival: arrivalCity, 
        date: date[Math.floor(Math.random() * Math.floor(date.length))],
        departureTime:Math.floor(Math.random() * Math.floor(23)) + ":00",
        price: Math.floor(Math.random() * Math.floor(125)) + 25,
      });
       
       await newUser.save();

    }

  }
  res.render('index', { title: 'Express' });
});


// Cette route est juste une verification du Save.
// Vous pouvez choisir de la garder ou la supprimer.
router.get('/result', function(req, res, next) {

  // Permet de savoir combien de trajets il y a par ville en base
  for(i=0; i<city.length; i++){

    journeyModel.find( 
      { departure: city[i] } , //filtre
  
      function (err, journey) {

          console.log(`Nombre de trajets au départ de ${journey[0].departure} : `, journey.length);
      }
    )

  }


  res.render('index', { title: 'Express' });
});

module.exports = router;
