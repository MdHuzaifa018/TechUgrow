const express = require('express');
const Blog = require('../models/Blog');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try { res.json(await Blog.find({ status: 'Published' }).sort('-createdAt')); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/all', protect, async (req, res) => {
  try { res.json(await Blog.find().sort('-createdAt')); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/', protect, async (req, res) => {
  try { res.status(201).json(await Blog.create(req.body)); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try { await Blog.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
