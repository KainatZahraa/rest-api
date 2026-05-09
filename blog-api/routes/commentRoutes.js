const express = require('express');
const router = express.Router();
const { deleteComment } = require('../controllers/commentController');

router.delete('/:id', deleteComment);

module.exports = router;