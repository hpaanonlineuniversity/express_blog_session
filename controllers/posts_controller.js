const Post = require('../models/post_model');
const User = require('../models/user_model');


// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const author = req.session.userId; // Assuming user ID is stored in session

    if (!author) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const newPost = new Post({ title, content, author });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username email');
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get a single post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username email');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update a post by ID
exports.updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const author = req.session.userId; // Assuming user ID is stored in session

    if (!author) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== author) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete a post by ID
exports.deletePost = async (req, res) => {
  try {
    const author = req.session.userId; // Assuming user ID is stored in session

    if (!author) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== author) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await post.remove();
    res.status(200).json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


// Check authentication status
exports.status = (req, res) => {
  if (req.session.userId) {
    res.status(200).json({ authenticated: true });
  } else {
    res.status(200).json({ authenticated: false });
  }
};


