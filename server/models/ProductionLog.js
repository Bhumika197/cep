const mongoose = require('mongoose');

const productionLogSchema = new mongoose.Schema({
  wasteRecordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WasteRecord',
    required: true
  },
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true
  },
  vermicompostYield: {
    type: Number,
    required: true,
    min: 0
  },
  biopesticideVolume: {
    type: Number,
    required: true,
    min: 0
  },
  vermicompostRevenue: {
    type: Number,
    required: true,
    min: 0
  },
  biopesticideRevenue: {
    type: Number,
    required: true,
    min: 0
  },
  inputCost: {
    type: Number,
    required: true,
    min: 0
  },
  laborCost: {
    type: Number,
    required: true,
    min: 0
  },
  dailyProfit: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ProductionLog', productionLogSchema);
