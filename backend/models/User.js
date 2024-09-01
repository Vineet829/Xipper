const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
  },
}, {
  timestamps: true,
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
