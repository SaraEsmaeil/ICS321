const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use('/tournaments', require('./routes/tournaments'));
app.use('/teams', require('./routes/teams'));
app.use('/joinRequests', require('./routes/joinRequests'));
app.use('/matches', require('./routes/matches')); 
app.use('/stats', require('./routes/stats')); 
app.use('/players', require('./routes/players'));
app.use('/captain', require('./routes/captain'));
app.use('/stats', require('./routes/stats'));






// ✅ Environment Logs
console.log("📦 ENV TEST → EMAIL =", process.env.EMAIL);
console.log("📦 ENV TEST → PASSWORD =", process.env.PASSWORD ? "Loaded ✅" : "Missing ❌");

// ✅ Email transporter
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

// ✅ Email endpoint
app.post('/send-notification', (req, res) => {
  const { to, subject, text } = req.body;

  let mailOptions = {
    from: process.env.EMAIL,
    to: to || 'dr.maher8496@gmail.com',
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

// ✅ Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
