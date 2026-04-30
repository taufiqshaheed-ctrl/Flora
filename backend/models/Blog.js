const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title:           { type: String, required: true },
  slug:            { type: String, required: true, unique: true },
  excerpt:         { type: String, default: '' },
  content:         { type: String, default: '' },
  image_url:       { type: String, default: '' },
  publishedAt:     { type: Date, default: Date.now },
  // SEO
  h1:              { type: String, default: '' },
  metaTitle:       { type: String, default: '' },
  metaKeywords:    { type: String, default: '' },
  metaDescription: { type: String, default: '' },
  // Extra uploaded images (URLs stored for use in content)
  contentImages:   [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
