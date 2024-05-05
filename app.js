require('dotenv').config();
const express = require('express');
const app = express();
const bookingRoutes = require('./app/routes/bookingRoutes');
const paymentRoutes = require('./app/routes/paymentRoutes');
const emailRoutes = require('./app/routes/emailRoutes');

const connectDB = require('./app/db/connect');
const cors = require('cors');

app.use(cors({
  origin: '*' 
}));

app.use(express.json());
app.use('/api', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/emails', emailRoutes);
app.get('/api/hello', (req, res) => {
  res.status(200).send('Hello World!');
});


module.exports = { app, connectDB };
