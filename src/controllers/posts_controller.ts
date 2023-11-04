import { Request, Response, NextFunction } from "express";
import { Post } from "../models/post_model";
import { deleteAllPostFiles } from "./files_controller";
import { Op } from "sequelize";
import { white } from "console-log-colors";

// get all posts
export const getAdminPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const posts = await Post.findAll({
      order: [["createdAt", "DESC"]]
    });

    if (!posts) {
      res.status(204).json({ message: "No hay posts" });
      return;
    }
    res.status(200).json({ message: "Posts", posts: posts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id_category, name_category } = req.query;

    console.log(name_category);

    const posts = await Post.scope("withoutCode").findAll({
      where: {
        isDraft: false,
        ...(id_category && {
          categories: {
            [Op.contains]: [
              {
                value: Number(id_category)
              }
            ]
          }
        }),
        ...(name_category && {
          categories: {
            [Op.contains]: [
              {
                label:
                  name_category.toString().charAt(0).toUpperCase() +
                  name_category.toString().slice(1) // TODO: fix this
              }
            ]
          }
        })
      },
      order: [["createdAt", "DESC"]]
    });

    const mostPopularPosts = await Post.scope("withoutCode").findAll({
      where: {
        isDraft: false
      },
      attributes: ["title", "slug", "likes"],
      order: [["likes", "DESC"]],
      limit: 5
    });

    res.status(200).json({
      message: "Posts",
      posts: posts,
      mostPopular: mostPopularPosts,
      count: posts.length
    });
  } catch (error) {
    console.log(white.bgRed("Error: " + error));
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const getPostBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slug } = req.params;

    const post = await Post.scope("withoutCode").findOne({
      where: {
        slug,
        isDraft: false
      }
    });

    if (!post) {
      res.status(404).json({ message: "Post no encontrado" });
      return;
    }

    res.status(200).json({ message: "Post", post });
  } catch (error) {
    console.log(white.bgRed("Error: " + error));
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const getPostSlugs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const posts = await Post.scope("withoutCode").findAll({
      where: {
        isDraft: false
      },
      attributes: ["slug"]
    });

    res.status(200).json({ message: "Posts", posts });
  } catch (error) {
    console.log(white.bgRed("Error: " + error));
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// get a single post by id
export const getPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id_post } = req.query;
    if (!id_post) {
      res.status(400).json({ message: "El id de post es requerido" });
      return;
    }
    const existingPost = await Post.findOne({
      where: {
        id_post
      }
    });

    if (!existingPost) {
      res.status(404).json({ message: "Post no encontrado" });
      return;
    }

    res.status(200).json({ message: "Post", post: existingPost });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// create a new post
export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newPost = await Post.create({
      title: "",
      excerpt: "",
      content: "",
      slug: "",
      categories: [],
      featuredImage: null,
      gallery: [],
      isDraft: true,
      author: ""
    });

    res.status(201).json({ message: "Post creado", post: newPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// update a post
export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.params.code) {
      res.status(400).json({ message: "El id de post es requerido" });
      return;
    }

    const existingPost = await Post.findByPk(req.params.code);

    if (!existingPost) {
      res.status(404).json({ message: "Post no encontrado" });
      return;
    }

    const updatedPost = await existingPost.update(req.body);

    res.status(200).json({ message: "Post actualizado", post: updatedPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// update a post likes
export const updatePostLikes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id_post } = req.params;
    if (!id_post) {
      res.status(400).json({ message: "El id de post es requerido" });
      return;
    }

    const existingPost = await Post.findOne({
      where: {
        id_post
      }
    });

    if (!existingPost) {
      res.status(404).json({ message: "Post no encontrado" });
      return;
    }

    const updatedPost = await existingPost.increment("likes");

    res.status(200).json({ message: "Post actualizado", post: updatedPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// delete a post
export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.params.code) {
      res.status(400).json({ message: "El id de post es requerido" });
      return;
    }
    const existingPost = await Post.findByPk(req.params.code);

    if (!existingPost) {
      res.status(404).json({ message: "Post no encontrado" });
      return;
    }

    await deleteAllPostFiles(req.params.code);

    await existingPost.destroy();

    const posts = await Post.findAll();

    res.status(200).json({ message: "Post eliminado", posts: posts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
