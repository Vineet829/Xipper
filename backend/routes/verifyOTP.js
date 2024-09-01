const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;
const client = new twilio(accountSid, authToken);

const User = require('../models/User');

router.post('/verify-otp', async (req, res) => {
  const { phoneNumber, otp } = req.body;

  try {
    let user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    const verificationCheck = await client.verify.v2.services(serviceSid)
      .verificationChecks
      .create({ to: phoneNumber, code: otp });

    if (verificationCheck.status === 'approved') {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '5m' });
      return res.json({ msg: 'OTP verified successfully', token });
    } else {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }
  } catch (err) {
    console.error('Error in verify-otp handler:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
