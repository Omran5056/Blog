const express = require('express');

const {  addPost,
    deletePost,
    getPost,
    getPosts,
    updatePost,} = require('../controllers/posts')

const router = express.Router();

router.route('/').get(getPosts).post(addPost)
router.route('/:id').get(getPost).put(updatePost).delete(deletePost)

module.exports = router;