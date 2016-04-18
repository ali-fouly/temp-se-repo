var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Flight = mongoose.model('Flight');
var Ticket = mongoose.model('Ticket');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendfile('views/index.html');
});

//List all flights
router.get('/flights', function (req, res, next) {
  Flight.find(function (err, flights) {
    if(err){return next(err);}
    res.json(flights);
  });
});

//Create a flight
router.post('/flights', function (req, res, next) {
  var flight = new Flight(req.body);
  flight.save(function (err, flight) {
    if (err) {return next(err);}
    res.json(flight);
  });
});


//Search by origin and destination (one way)
router.post('/search/flights', function (req, res, next) {
  
  if(req.body.flightClass === 'first'){
    var query = Flight.find({origin: req.body.origin, destination: req.body.destination, date: req.body.departureDate, 'available_seats.available_first' : {$gte: 1}});
  }else if(req.body.flightClass === 'business'){
    var query = Flight.find({origin: req.body.origin, destination: req.body.destination, date: req.body.departureDate, 'available_seats.available_business' : {$gte: 1}});
  }else if(req.body.flightClass === 'economy'){
    var query = Flight.find({origin: req.body.origin, destination: req.body.destination, date: req.body.departureDate, 'available_seats.available_economy' : {$gte: 1}});
  }

  query.exec(function (err, flights) {
    if (err) {
      return next(err);
    }

    res.json(flights);
  });
});

//Search by origin and destination (two way)
router.post('/search/flights/both', function (req, res, next) {

  if(req.body.flightClass === 'first'){
    Flight.find({origin: req.body.origin, destination: req.body.destination, date: req.body.departureDate, 'available_seats.available_first' : {$gte: 1}}, function (err, to) {
      if (err) {return next(err);}
      Flight.find({destination: req.body.origin, origin: req.body.destination, date: req.body.returningDate, 'available_seats.available_first' : {$gte: 1}},function (err,from) {
        if (err) {return next(err);}
        res.json({outgoing: to, returning: from});
      });
    });
  }else if(req.body.flightClass === 'business'){
    Flight.find({origin: req.body.origin, destination: req.body.destination, date: req.body.departureDate, 'available_seats.available_business' : {$gte: 1}}, function (err, to) {
      if (err) {return next(err);}
      Flight.find({destination: req.body.origin, origin: req.body.destination, date: req.body.returningDate, 'available_seats.available_business' : {$gte: 1}},function (err,from) {
        if (err) {return next(err);}
        res.json({outgoing: to, returning: from});
      });
    });
  }else if(req.body.flightClass === 'economy'){
    Flight.find({origin: req.body.origin, destination: req.body.destination, date: req.body.departureDate, 'available_seats.available_economy' : {$gte: 1}}, function (err, to) {
      if (err) {return next(err);}
      Flight.find({destination: req.body.origin, origin: req.body.destination, date: req.body.returningDate, 'available_seats.available_economy' : {$gte: 1}},function (err,from) {
        if (err) {return next(err);}
        res.json({outgoing: to, returning: from});
      });
    });
  }



});


//Create a pre-loading object
router.param('flight', function (req, res, next, id) {
  
  var query = Flight.findById(id);
  
  query.exec(function (err, flight) {
    
    if(err){return next(err);}
    
    if(!flight){return next(new Error('Can\'t find the flight.'))}
    
    req.flight = flight;

    return next();
    
  });
  
});


//Show flight
router.get('/flights/:flight', function (req, res, next) {
  
  req.flight.populate('tickets', function (err, flight) {
    if(err){return next(err);}
    
    res.json(flight);
  });
  
});

//Create a ticket
router.post('/tickets', function (req, res, next) {
  var ticket = new Ticket(req.body);
  ticket.save(function (err, ticket) {
    if (err) {return next(err);}
    res.json(ticket);
  });
});

//buy ticket
router.post('/flights/:flight/buy', function(req, res, next){

});

//List all tickets
router.get('/tickets', function (req, res, next) {
  Ticket.find(function (err, tickets) {
    if(err){return next(err);}
    res.json(tickets);
  });
});


router.get('/db/seed', function (req, res, next) {


var flightSeeder = [

{
  flight_number: 909,
    aircraft: 'Boeing',
    origin: 'London',
    destination: 'Cairo',
    date: '08/08/2016',
    time: '5:00 PM',
    duration: '3 hours',
    capacity: [
      {"capacity_first": 5 ,"capacity_business": 5 ,"capacity_economy": 5}
    ],
    available_seats: [
      {"available_first": 5 ,"available_business": 5 ,"available_economy": 5}
    ],
    price: [
      {"price_first": 30,"price_business": 20,"price_economy": 10}
    ]
},

{
  flight_number: 500,
    aircraft: 'Boeing',
    origin: 'London',
    destination: 'Cairo',
    date: '09/09/2016',
    time: '5:00 PM',
    duration: '3 hours',
    capacity: [
      {"capacity_first": 5 ,"capacity_business": 5 ,"capacity_economy": 5}
    ],
    available_seats: [
      {"available_first": 5 ,"available_business": 5 ,"available_economy": 5}
    ],
    price: [
      {"price_first": 30,"price_business": 20,"price_economy": 10}
    ]
}

];

Flight.create(flightSeeder, function(err, flightSeeder){
    if(err){return next(err);}

    res.json(flightSeeder);
  })

});

module.exports = router;
