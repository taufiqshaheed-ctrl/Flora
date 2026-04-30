const mongoose = require('mongoose');

const pageContentSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  title: { type: String, default: '' },
  content: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('PageContent', pageContentSchema);
