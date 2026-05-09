const express = require('express');
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getPostsByTag,
  getPostById,
  updatePost,
  deletePost,
} = require('../controllers/postController');
const { addComment, getCommentsByPost } = require('../controllers/commentController');


router.get('/tag/:tag', getPostsByTag);

router.post('/', createPost);
router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

// Comment routes under posts
router.post('/:postId/comments', addComment);
router.get('/:postId/comments', getCommentsByPost);

module.exports = router;