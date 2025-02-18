import { Router } from "express";

import authenticateJWT from "../controllers/authController.js";

import {
  getBlogPosts,
  createPost,
  deletePost,
  updatePost,
  getBlogPostById,
} from "../controllers/postController.js";

const router = Router();

//Get all blogs route

router.get("/", getBlogPosts);

router.get("/:id", getBlogPostById);

// Create post route
router.post("/", authenticateJWT, createPost);

// Delete post route
router.delete("/:id", authenticateJWT, deletePost);

// Update post route
router.put("/:id", authenticateJWT, updatePost);

export default router;
