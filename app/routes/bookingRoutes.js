const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const sendEmail = require('../services/emailService');

const MAX_SLOTS_PER_DAY = 10;

router.post('/book-slot', async (req, res) => {
  const { username, contactNumber, email, bookingDate, tankSize } = req.body;

  if (!username || !contactNumber || !email || !bookingDate || !tankSize) {
    return res.status(400).json({ message: 'Missing required information' });
  }

  const bookingsForDay = await Booking.countDocuments({ bookingDate });

  if (bookingsForDay >= MAX_SLOTS_PER_DAY) {
    return res.status(400).json({ message: 'No slots available for this day' });
  }

  const booking = new Booking({ username, contactNumber, email, bookingDate, tankSize });
  await booking.save();

  const customerEmailSubject = 'Your Tank Cleaning Appointment Confirmation with SD Cleaning Services';

  const serviceProviderEmail = 'shubhdaswani31@gmail.com';
  const serviceProviderEmailSubject = 'New Tank Cleaning Appointment Booked';
  const customerEmailHTML = `
<html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; }
      .container { width: 100%; max-width: 600px; margin: auto; }
      .header { background-color: #007bff; color: white; padding: 10px; text-align: center; }
      .content { padding: 20px; }
      .footer { background-color: #f3f3f3; padding: 10px; text-align: center; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2>Appointment Confirmation</h2>
      </div>
      <div class="content">
        <p>Dear ${username},</p>
        <p>Your tank cleaning appointment with SD Cleaning Services has been confirmed.</p>
        <p><strong>Booking Details:</strong></p>
        <p><strong>Date:</strong> ${bookingDate}</p>
        <p><strong>Tank Size:</strong> ${tankSize}</p>
        <p>If you have any questions or need to reschedule, please contact us at your earliest convenience.</p>
        <p>You can reach us at +91 8698651987 or via email at SDWaterCleaning@Service.Com</p>
        <p>Thank you for choosing SD Cleaning Services.</p>        
      </div>
      <div class="footer">
        <p>&copy; 2024 SD Cleaning Services</p>
      </div>
    </div>
  </body>
</html>
`;

  // Define the serviceProviderEmailHTML variable here
  const serviceProviderEmailHTML = `
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
    .container { width: 100%; max-width: 600px; margin: auto; }
    .header { background-color: #f3f3f3; padding: 10px; text-align: center; }
    .content { padding: 20px; }
    .footer { background-color: #f3f3f3; padding: 10px; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>New Booking Alert</h2>
    </div>
    <div class="content">
      <p>A new tank cleaning appointment has been booked. Details are as follows:</p>
      <p><strong>Customer Name:</strong> ${username}</p>
      <p><strong>Contact Number:</strong> ${contactNumber}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Booking Date:</strong> ${bookingDate}</p>
      <p><strong>Tank Size:</strong> ${tankSize}</p>
      <p>Please ensure the schedule is updated accordingly and preparations are made for the service.</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 SD Cleaning Services</p>
    </div>
  </div>
</body>
</html>
`;

  sendEmail({
    to: email,
    subject: customerEmailSubject,
    html: customerEmailHTML
  }).catch(error => console.error('Failed to send customer confirmation email:', error));

  sendEmail({
    to: serviceProviderEmail,
    subject: serviceProviderEmailSubject,
    html: serviceProviderEmailHTML
  }).catch(error => console.error('Failed to send service provider notification email:', error));

  res.status(201).json({
    message: 'Slot booked successfully and confirmation emails are being sent.',
    booking: {
      username,
      contactNumber,
      email,
      bookingDate,
      tankSize,
    }
  });
});


router.get('/available-slots/:date', async (req, res) => {
  const { date } = req.params;
  const bookingsForDay = await Booking.countDocuments({ bookingDate: date });
  const slotsAvailable = MAX_SLOTS_PER_DAY - bookingsForDay;

  res.status(200).json({
    message: `Available slots for ${date}`,
    date,
    slotsAvailable,
  });
});


module.exports = router;
