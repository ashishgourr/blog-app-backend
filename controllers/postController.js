import Post from "../models/Post.js";

//GET All Posts

export async function getBlogPosts(req, res) {
  try {
    //Get posts in descending order
    const posts = await Post.find().sort({ createdAt: -1 });
    //const posts = await Post.find().sort({ timestamp: -1 });

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching posts" });
  }
}

// GET a particular Blog post by ID
export async function getBlogPostById(req, res) {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching post" });
  }
}

// CREATE a new Blog post

export async function createPost(req, res) {
  const { title, content } = req.body;
  const userId = req.user.userId;

  if (!userId || !title || !content) {
    return res.status(400).json({
      message: "Title and content are required to create a new blog post",
    });
  }
  try {
    const newPost = new Post({
      title: title,
      content: content,
      userId: userId,
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating post" });
  }
}

//DELETE a Blog post

export async function deletePost(req, res) {
  const { id } = req.params;

  try {
    // Find the post by ID and make sure it exists
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Ensure the user is the owner of the post
    if (post.userId.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post" });
    }

    // Delete the post

    await Post.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting post" });
  }
}

// UPDATE a Blog Post

export async function updatePost(req, res) {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    // Find the post by ID
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the logged-in user is the owner of the post
    if (post.userId.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to edit this post" });
    }

    // Update the post
    post.title = title || post.title;
    post.content = content || post.content;

    // Save the updated post
    const updatedPost = await post.save();

    res.json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating post" });
  }
}
