require('../models/connect')
var express = require('express');
var router = express.Router();
var journeyModel = require('../models/journey')
var UserModel = require('../models/users')

var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"]
var date = ["2018-11-20","2018-11-21","2018-11-22","2018-11-23","2018-11-24"]

/* Sign page. */
router.get('/', function(req, res, next) {
  res.render('index',);
});

/* Search page  */
router.post('/search', async function(req, res, next) {
  /* To resolve Case errors */
  if (!req.session.user){
    return res.redirect('/login');
  }

  const results = await journeyModel.find({
    departure: req.body.departure,
    arrival: req.body.arrival,
    date: req.body.date
  });

  res.render('journey', { results });
});


router.get('/mybooks2', function(req, res, next) {
  if (req.session.journey === undefined || req.session.journey === null) {

    req.session.journey = [];
  }
  
  if (req.query.departure) {
  req.session.journey.push({
    departure: req.query.departure,
    arrival: req.query.arrival,
    price: req.query.price,
    date: req.query.date
  })}
  console.log(req.session.journey)
    time: req.query.time,
  res.render('mybooks', {journey : req.session.journey});
});

/* A supprimer, juste pour check */
router.get('/homepage', function(req, res, next) {
  if (!req.session.user) {
    res.render('index');
  }
  res.render('homepage');
});


router.get('/notrain', function(req, res, next) {
  res.render('notrain');
});


router.get('/add-trip', async (req, res) => {
  if (!req.session.user){
    return res.redirect('/login');
  }
  if (req.session.user.trips) {
    req.session.user.trips.push(req.query.trip_id);
    

  } else {
    req.session.user.trips = [req.query.trip_id]
  }
  //console.log('SESSION: ', req.session.user);
  res.redirect('/mybooks');
});

router.get('/mybooks', async (req, res, next) => {
  if (!req.session.user){
    return res.redirect('/login');
  }



  const trips = [];
  for (let i = 0; i < req.session.user.trips.length; i++){
    const journey = await journeyModel.findById(req.session.user.trips[i]);
    trips.push(journey);
    //console.log('TRIPS DURING LOOP: ', trips);
  }

  res.render('mybooks', { trips });
});

router.get('/confirm-checkout', async (req, res) => {
  if (!req.session.user){
    return res.redirect('/login');
  }

  const user = await UserModel.findById(req.session.user.id);

  const trips = user.trips? [...user.trips] : [];
  req.session.user.trips.forEach( (trip_id) => {
    trips.push( trip_id );
  })
  
  await UserModel.updateOne({ user, trips });
  req.session.user.trips = [];

  res.redirect('/');
})

/* Get Last trips */
router.get('/lasttrips', async (req, res) => {
  if (!req.session.user){
    return res.redirect('/login');
  }
  const trips = {
    date: "1 er Juillet 2022", 
    departure: "Marseille", 
    arrival: "Paris", 
    departureTime: "13h",
    price: "75"
  }

  res.render('lasttrips', { trips: trips });
})




router.get('/login', function(req,res,next) { 
  res.render('index')
});


/* GET Home page. */

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
