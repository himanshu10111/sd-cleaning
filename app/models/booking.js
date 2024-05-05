const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  username: String,
  contactNumber: String,
  email: String,
  bookingDate: String, 
  tankSize: String, 
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
