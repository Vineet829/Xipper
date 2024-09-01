require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const sendOTPRoute = require('./routes/sendOTP');
const verifyOTPRoute = require('./routes/verifyOTP');

const app = express();


app.use(express.json());


app.use('/api/auth', sendOTPRoute);
app.use('/api/auth', verifyOTPRoute);


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err.message));


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
