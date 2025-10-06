const postsController = require('../controllers/posts_controller');
const postsmiddleware = require('../middleware/posts_middleware');
const express = require('express');
const router = express.Router();



// Create a new post (not protected route)
//router.post('/', postsController.createPost);

//Create a new post (protected route)
router.post('/', postsmiddleware.isAuthenticated, postsController.createPost);

// Get all posts (not protected route)
// router.get('/', postsController.getAllPosts);

//Get all posts (protected route)
router.get('/', postsmiddleware.isAuthenticated, postsController.getAllPosts);

// Get a single post by ID (protected route)
router.get('/:id', postsmiddleware.isAuthenticated, postsController.getPostById);

// Update a post by ID (protected route)
router.put('/:id', postsmiddleware.isAuthenticated, postsController.updatePost);

// Delete a post by ID (protected route)
router.delete('/:id',postsmiddleware.isAuthenticated, postsController.deletePost);

module.exports = router;