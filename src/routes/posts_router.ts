import { Router } from "express";
import {
  getAdminPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getPosts,
  getPostSlugs,
  getPostBySlug,
  updatePostLikes
} from "../controllers/posts_controller";
import { verifyAuth } from "../middlewares/verifyAuth";

const postsRouter = Router();

// CRUD Routes /posts
postsRouter.get("/", getPosts); // /posts
postsRouter.get("/slug/", getPostSlugs); // /posts/slug
postsRouter.get("/slug/:slug/", getPostBySlug); // /posts/slug/:slug
postsRouter.get("/admin/", verifyAuth, getAdminPosts); // /posts/admin
postsRouter.post("/", verifyAuth, createPost); // /posts
postsRouter.get("/:code/", getPost); // /posts/:code
postsRouter.get("/admin/:id_post/", verifyAuth, getPost); // /posts/:id_post
postsRouter.put("/:code/", verifyAuth, updatePost); // /posts/:code
postsRouter.delete("/:code/", verifyAuth, deletePost); // /posts/:code
postsRouter.post("/like/:id_post/", updatePostLikes); // /posts/like/:id_post

export default postsRouter;
