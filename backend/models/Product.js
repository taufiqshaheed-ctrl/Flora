const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image_url: { type: String, required: true },
  delivery_time: { type: String, default: 'Delivery in 2-4 hours' },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
