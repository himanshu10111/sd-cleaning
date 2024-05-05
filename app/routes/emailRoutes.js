const express = require('express');
const router = express.Router();
const sendEmail = require('../services/emailService');

router.post('/send', (req, res) => {
  const { to, subject, text, html } = req.body;

  sendEmail({ to, subject, text, html })
    .then(() => res.status(200).json({ message: 'Email sent!' }))
    .catch(error => res.status(500).json({ error: error.message }));
});

module.exports = router;
