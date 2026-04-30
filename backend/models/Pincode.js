const mongoose = require('mongoose');

const pincodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, trim: true },
  area: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Pincode', pincodeSchema);
