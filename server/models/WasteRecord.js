const mongoose = require('mongoose');

const wasteRecordSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true
  },
  dungCollected: {
    type: Number,
    required: true,
    min: 0
  },
  urineCollected: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  laborHours: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WasteRecord', wasteRecordSchema);
