const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const twilio = require('twilio');
require('dotenv').config();


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;
const client = new twilio(accountSid, authToken);

const User = require('../models/User');

router.post('/send-otp', [
  check('phoneNumber', 'Phone number is required').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { phoneNumber } = req.body;

  try {
    let user = await User.findOne({ phoneNumber });

    const verification = await client.verify.v2.services(serviceSid)
      .verifications
      .create({ to: phoneNumber, channel: 'sms' });

    if (!user) {
      user = new User({
        phoneNumber,
      });

      await user.save();
    }

    res.json({ msg: 'OTP sent successfully', status: 'not_registered', sid: verification.sid });
  } catch (err) {
    console.error('Error in send-otp handler:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
