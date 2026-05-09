const Comment = require('../models/Comment');
const Post = require('../models/Post');
const User = require('../models/User');
const mongoose = require('mongoose');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// POST /api/posts/:postId/comments — Add a comment to a post
exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text, user } = req.body;

    if (!isValidId(postId)) {
      return res.status(400).json({ success: false, message: 'Invalid post ID format' });
    }

    if (!text || !user) {
      return res.status(400).json({ success: false, message: 'text and user are required' });
    }

    if (!isValidId(user)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID format' });
    }

    // Validate both post and user exist
    const [postExists, userExists] = await Promise.all([
      Post.findById(postId),
      User.findById(user),
    ]);

    if (!postExists) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    if (!userExists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const comment = await Comment.create({ text, post: postId, user });
    await comment.populate('user', 'username email');

    res.status(201).json({ success: true, message: 'Comment added successfully', data: comment });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// GET /api/posts/:postId/comments — Get all comments for a post
exports.getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!isValidId(postId)) {
      return res.status(400).json({ success: false, message: 'Invalid post ID format' });
    }

    const postExists = await Post.findById(postId);
    if (!postExists) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const comments = await Comment.find({ post: postId })
      .populate('user', 'username email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: comments.length, data: comments });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// DELETE /api/comments/:id — Delete a specific comment
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid comment ID format' });
    }

    const comment = await Comment.findByIdAndDelete(id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    res.status(200).json({ success: true, message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};