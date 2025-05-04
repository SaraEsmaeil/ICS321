const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 👉 Routes mounting
app.use('/tournaments', require('./routes/tournaments'));
app.use('/teams', require('./routes/teams'));
app.use('/players', require('./routes/players'));
app.use('/matches', require('./routes/matches'));
app.use('/cards', require('./routes/cards'));
app.use('/stats', require('./routes/stats'));
app.use('/fields', require('./routes/fields'));
app.use('/join-requests', require('./routes/joinRequests'));

// ✅ Logs for ENV
console.log("📦 ENV TEST → EMAIL =", process.env.EMAIL);
console.log("📦 ENV TEST → PASSWORD =", process.env.PASSWORD ? "Loaded ✅" : "Missing ❌");

// ✉️ Email transporter
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

// ✅ Define an endpoint to trigger email manually
app.post('/send-notification', (req, res) => {
  const { to, subject, text } = req.body;  // use req.body data for dynamic email

  let mailOptions = {
    from: process.env.EMAIL,
    to: to || 'dr.maher8496@gmail.com',  // fallback email if no `to` provided
    subject: subject || 'Team Notification',
    text: text || 'Next match is on May 3!'
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.error('❌ Email failed:', err);
      return res.status(500).json({ error: 'Failed to send email' });
    } else {
      console.log('✅ Email sent:', data.response);
      return res.json({ message: 'Email sent successfully!' });
    }
  });
});

// ✅ Run server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
