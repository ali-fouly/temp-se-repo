var mongoose = require('mongoose');

var TicketSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    phone: Number,
    country: String,
    address: String,
    class: String,
    seat_number: Number,
    price: Number,
    flights:[{type: mongoose.Schema.Types.ObjectId, ref: 'Flight'}]
});

mongoose.model('Ticket', TicketSchema);