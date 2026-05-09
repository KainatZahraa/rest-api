const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
const mongoose = require('mongoose');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// POST /api/posts — Create a new post
exports.createPost = async (req, res) => {
  try {
    const { title, content, author, tags } = req.body;

    if (!title || !content || !author) {
      return res.status(400).json({
        success: false,
        message: 'title, content, and author are required',
      });
    }

    if (!isValidId(author)) {
      return res.status(400).json({ success: false, message: 'Invalid author ID format' });
    }

    // Check author exists
    const userExists = await User.findById(author);
    if (!userExists) {
      return res.status(404).json({ success: false, message: 'Author not found' });
    }

    const post = await Post.create({ title, content, author, tags });
    await post.populate('author', 'username email');

    res.status(201).json({ success: true, message: 'Post created successfully', data: post });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// GET /api/posts — Get all posts with author populated
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: posts.length, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// GET /api/posts/tag/:tag — Get posts by tag
exports.getPostsByTag = async (req, res) => {
  try {
    const { tag } = req.params;

    const posts = await Post.find({ tags: tag })
      .populate('author', 'username email');

    res.status(200).json({ success: true, count: posts.length, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// GET /api/posts/:id — Get single post with author and comments
exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid post ID format' });
    }

    const post = await Post.findById(id).populate('author', 'username email');
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const comments = await Comment.find({ post: id }).populate('user', 'username email');

    res.status(200).json({
      success: true,
      data: { ...post.toObject(), comments },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// PUT /api/posts/:id — Update a post
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid post ID format' });
    }

    const { title, content, tags } = req.body;
    const post = await Post.findByIdAndUpdate(
      id,
      { $set: { title, content, tags } },
      { new: true, runValidators: true }
    ).populate('author', 'username email');

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.status(200).json({ success: true, message: 'Post updated successfully', data: post });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// DELETE /api/posts/:id — Delete post and all its comments
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid post ID format' });
    }

    const post = await Post.findByIdAndDelete(id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Cascade delete all comments for this post
    await Comment.deleteMany({ post: id });

    res.status(200).json({
      success: true,
      message: 'Post and all associated comments deleted successfully',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};