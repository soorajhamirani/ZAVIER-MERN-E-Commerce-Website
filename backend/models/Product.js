const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  size: { type: String, required: true }, // e.g. UK 8, UK 10, UK 12, UK 14
  color: { type: String, required: true },
  stockCount: { type: Number, required: true, default: 0 }
});

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  categories: [{ type: String, required: true, index: true }], // e.g. dresses, tailoring, new-arrivals
  gender: { type: String, enum: ['Mens', 'Womens', 'Childrens'], index: true },
  season: { type: String, enum: ['Winter', 'Summer'], index: true },
  images: [{ type: String, required: true }],
  variants: [variantSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
