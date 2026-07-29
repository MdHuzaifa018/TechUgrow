const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  excerpt: { type: String },
  content: { type: String },
  category: { type: String },
  author: { type: String },
  image: { type: String },
  readTime: { type: String },
  status: { type: String, enum: ['Draft', 'Published'], default: 'Draft' },
}, { timestamps: true });

blogSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Blog', blogSchema);
