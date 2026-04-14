const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  numberOfCows: {
    type: Number,
    required: true,
    min: 1
  },
  primaryGoal: {
    type: String,
    required: true,
    enum: ['vermicompost', 'biopesticide', 'both']
  },
  languagePreference: {
    type: String,
    default: 'hi',
    enum: ['hi', 'en', 'gu', 'mr', 'ta', 'te']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Farmer', farmerSchema);
