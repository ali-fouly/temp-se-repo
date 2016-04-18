var mongoose = require('mongoose');

var FlightsSchema = new mongoose.Schema({
    flight_number: Number,
    aircraft: String,
    origin: String,
    destination: String,
    date: Date,
    time: String,
    duration: String,
    capacity: [
        {"capacity_first": Number ,"capacity_business": Number ,"capacity_economy": Number}
    ],
    available_seats: [
        {"available_first": Number ,"available_business": Number ,"available_economy": Number}
    ],
    price: [
        {"price_first": Number,"price_business": Number,"price_economy": Number}
    ],
    tickets: [{type: mongoose.Schema.Types.ObjectId, ref: 'Ticket'}]
});

mongoose.model('Flight', FlightsSchema);