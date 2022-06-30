require('../models/connect')
var express = require('express');
var router = express.Router();
var journeyModel = require('../models/journey')
var UserModel = require('../models/users')

var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"]
var date = ["2018-11-20","2018-11-21","2018-11-22","2018-11-23","2018-11-24"]


/* GET Sign page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/homepage', function(req, res, next) {
  res.render('homepage');
});

/* Search page  */
router.post('/search', async function(req, res, next) {
  var departure = req.body.departure.toLowerCase()
  departure = departure.charAt(0).toUpperCase() + departure.slice(1)
  var arrival = req.body.arrival.toLowerCase()
  arrival = arrival.charAt(0).toUpperCase() + arrival.slice(1)

  var data = {
    departure: departure,
    arrival: arrival,
    date: req.body.date,
  }

  var journey = await journeyModel.find(data) 

  if (journey.length > 0) {
    res.render('journey', {journey});
  } else {
    res.render('notrain');
  }
});

/* GET Home page. */
router.get('/journey', function(req, res, next) {
  res.render('journey');
});

router.get('/lasttrips', function(req, res, next) {
  res.render('lasttrips');
});

router.get('/mybooks', function(req, res, next) {
  res.render('mybooks');
});

router.get('/notrain', function(req, res, next) {
  res.render('notrain');
});

router.get('/mylasttrips', function(req,res,next) { 
  
    res.render('mylasttrips')
}); 

router.get('/mybooks', function(req,res,next) { 
  
  res.render('mybooks')
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
