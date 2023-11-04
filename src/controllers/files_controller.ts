import { Request, Response, NextFunction } from "express";
import { Post } from "../models/post_model";
import { Project } from "../models/project_model";
import { Upload } from "@aws-sdk/lib-storage";
import multiparty from "multiparty";
import { white } from "console-log-colors";
import fs from "fs";
import {
  S3Client,
  DeleteObjectCommand,
  ListObjectsV2Command
} from "@aws-sdk/client-s3";

enum EntityType {
  POSTS = "posts",
  PROJECTS = "projects"
}

// get all post files
export const getFiles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { entityType, code } = req.params;

    if (!code || !entityType) {
      res
        .status(400)
        .json({ message: "El tipo de entidad y el código con requeridos" });
      return;
    }

    const existingEntity =
      entityType === EntityType.POSTS
        ? await Post.findByPk(code)
        : await Project.findByPk(code);

    if (!existingEntity) {
      res.status(404).json({ message: "Entidad no encontrada" });
      return;
    }

    res.status(200).json({
      message: "Archivos obtenidos correctamente",
      files: {
        featuredImage: existingEntity.featuredImage,
        gallery: existingEntity.gallery
      }
    });
  } catch (error) {
    console.log(white.bgRed("Error al obtener archivos--> " + error));
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// upload post files
export const uploadFiles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { entityType, code } = req.params;

    if (!code || !entityType) {
      res
        .status(400)
        .json({ message: "El tipo de entidad y el código con requeridos" });
      return;
    }

    const existingEntity =
      entityType === EntityType.POSTS
        ? await Post.findByPk(code)
        : await Project.findByPk(code);

    if (!existingEntity) {
      res.status(404).json({ message: "Entidad no encontrada" });
      return;
    }

    const form = new multiparty.Form();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(400).json({ message: "Error al subir los archivos" });
        return;
      }

      const { type } = fields;

      if (!type) {
        res.status(400).json({ message: "El tipo de archivo es requerido" });
        return;
      }

      let featured_image_upload = null;
      let gallery_images_upload = [];

      const s3Client = new S3Client({
        region: process.env.S3_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
        }
      });

      if (!files) {
        res.status(400).json({ message: "El archivo es requerido" });
        return;
      }

      if (type[0] === "featuredImage") {
        const file = files.featuredImage[0];
        const fileContent = fs.readFileSync(file.path);
        const upload = new Upload({
          client: s3Client,
          params: {
            Bucket: process.env.S3_BUCKET!,
            Key: `${entityType}/${existingEntity.getDataValue(
              entityType === EntityType.POSTS ? "id_post" : "id_project"
            )}/${type}/${file.originalFilename.replaceAll(
              /[^a-zA-Z0-9/.]/g,
              "-"
            )}`,
            Body: fileContent,
            ContentType: file.headers["content-type"],
            ContentLength: file.byteCount
          }
        });

        const result: any = await upload.done();

        if (!result) {
          res
            .status(400)
            .json({ message: "Error al subir los archivos a AWS" });
          return;
        }
        featured_image_upload = {
          url: result.Location.replace(/%2F/g, "/"),
          size: file.size,
          name: file.originalFilename.replaceAll(/[^a-zA-Z0-9/.]/g, "-")
        };
      }

      if (type[0] === "gallery") {
        for (let i = 0; i < files.gallery.length; i++) {
          const file = files.gallery[i];
          const fileContent = fs.readFileSync(file.path);
          const upload = new Upload({
            client: s3Client,
            params: {
              Bucket: process.env.S3_BUCKET!,
              // replace [^a-zA-Z0-9/]" , "-"
              Key: `${entityType}/${existingEntity.getDataValue(
                entityType === EntityType.POSTS ? "id_post" : "id_project"
              )}/${type}/${file.originalFilename.replaceAll(
                /[^a-zA-Z0-9/.]/g,
                "-"
              )}`,
              Body: fileContent,
              ContentType: file.headers["content-type"],
              ContentLength: file.byteCount
            }
          });

          const result: any = await upload.done();

          if (!result) {
            res
              .status(400)
              .json({ message: "Error al subir los archivos a AWS" });
            return;
          }

          gallery_images_upload.push({
            url: result.Location.replace(/%2F/g, "/"),
            size: file.size,
            name: file.originalFilename.replaceAll(/[^a-zA-Z0-9/.]/g, "-")
          });
        }
      }

      const updatedEntity =
        entityType === EntityType.POSTS
          ? await Post.update(
              {
                featuredImage:
                  type[0] === "featuredImage"
                    ? featured_image_upload
                    : existingEntity.getDataValue("featuredImage"),
                gallery:
                  type[0] === "gallery"
                    ? [
                        ...existingEntity.getDataValue("gallery"),
                        ...gallery_images_upload
                      ]
                    : existingEntity.getDataValue("gallery")
              },
              { where: { code } }
            )
          : await Project.update(
              {
                featuredImage:
                  type[0] === "featuredImage"
                    ? featured_image_upload
                    : existingEntity.getDataValue("featuredImage"),
                gallery:
                  type[0] === "gallery"
                    ? [
                        ...existingEntity.getDataValue("gallery"),
                        ...gallery_images_upload
                      ]
                    : existingEntity.getDataValue("gallery")
              },
              { where: { code } }
            );

      if (!updatedEntity) {
        res.status(400).json({ message: "Error al actualizar el post" });
        return;
      }

      res.status(201).json({
        message: "Archivo subido correctamente",
        file: {
          featuredImage:
            type[0] === "featuredImage"
              ? featured_image_upload
              : existingEntity.getDataValue("featuredImage"),
          gallery:
            type[0] === "gallery"
              ? [
                  ...existingEntity.getDataValue("gallery"),
                  ...gallery_images_upload
                ]
              : existingEntity.getDataValue("gallery")
        }
      });
    });
  } catch (error) {
    console.log(white.bgRed("Error al subir archivos--> " + error));
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// delete post files
export const deleteFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { entityType, code } = req.params;

    if (!code || !entityType) {
      res
        .status(400)
        .json({ message: "El tipo de entidad y el código con requeridos" });
      return;
    }

    const existingEntity =
      entityType === EntityType.POSTS
        ? await Post.findByPk(code)
        : await Project.findByPk(code);

    if (!existingEntity) {
      res.status(404).json({ message: "Entidad no encontrada" });
      return;
    }

    const { url, type } = req.body;

    if (!url || !type) {
      res
        .status(400)
        .json({ message: "La ruta y el tipo de archivo son requeridos" });
      return;
    }

    const s3Client = new S3Client({
      region: process.env.S3_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
      }
    });

    const deleteObjectCommand = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: url.split(".com/")[1]
    });

    const result = await s3Client.send(deleteObjectCommand);

    if (!result) {
      res.status(400).json({ message: "Error al eliminar el archivo" });
      return;
    }

    const updatedEntity =
      entityType === EntityType.POSTS
        ? await Post.update(
            {
              featuredImage:
                type === "featuredImage"
                  ? null
                  : existingEntity.getDataValue("featuredImage"),
              gallery:
                type === "gallery"
                  ? existingEntity
                      .getDataValue("gallery")
                      .filter((image: any) => image.url !== url)
                  : existingEntity.getDataValue("gallery")
            },
            { where: { code } }
          )
        : await Project.update(
            {
              featuredImage:
                type === "featuredImage"
                  ? null
                  : existingEntity.getDataValue("featuredImage"),
              gallery:
                type === "gallery"
                  ? existingEntity
                      .getDataValue("gallery")
                      .filter((image: any) => image.url !== url)
                  : existingEntity.getDataValue("gallery")
            },
            { where: { code } }
          );

    if (!updatedEntity) {
      res.status(400).json({ message: "Error al actualizar la entidad" });
      return;
    }

    res.status(200).json({
      message: "Archivo eliminado correctamente",
      file: {
        featuredImage:
          type === "featuredImage"
            ? null
            : existingEntity.getDataValue("featuredImage"),
        gallery:
          type === "gallery"
            ? existingEntity
                .getDataValue("gallery")
                .filter((image: any) => image.url !== url)
            : existingEntity.getDataValue("gallery")
      }
    });
  } catch (error) {
    console.log(white.bgRed("Error al eliminar archivo--> " + error));
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// delete all post files
export const deleteAllPostFiles = async (code: string) => {
  try {
    if (!code) {
      return;
    }

    const existingPost = await Post.findByPk(code);

    if (!existingPost) {
      return;
    }

    const s3Client = new S3Client({
      region: process.env.S3_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
      }
    });

    const listObjectsCommand = new ListObjectsV2Command({
      Bucket: process.env.S3_BUCKET!,
      Prefix: `posts/${existingPost.getDataValue("id_post")}`
    });

    const result = await s3Client.send(listObjectsCommand);

    if (!result) {
      return;
    }

    const objects = result.Contents;

    if (!objects) {
      return;
    }

    const deleteObjectCommands = objects.map((object) => {
      return new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET!,
        Key: object.Key
      });
    });

    await Promise.all(
      deleteObjectCommands.map((command) => s3Client.send(command))
    );

    return;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const deleteAllProjectFiles = async (code: string) => {
  try {
    if (!code) {
      return;
    }

    const existingProject = await Project.findByPk(code);

    if (!existingProject) {
      return;
    }

    const s3Client = new S3Client({
      region: process.env.S3_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
      }
    });

    const listObjectsCommand = new ListObjectsV2Command({
      Bucket: process.env.S3_BUCKET!,
      Prefix: `projects/${existingProject.getDataValue("id_project")}`
    });

    const result = await s3Client.send(listObjectsCommand);

    if (!result) {
      return;
    }

    const objects = result.Contents;

    if (!objects) {
      return;
    }

    const deleteObjectCommands = objects.map((object) => {
      return new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET!,
        Key: object.Key
      });
    });

    await Promise.all(
      deleteObjectCommands.map((command) => s3Client.send(command))
    );

    return;
  } catch (error) {
    console.log(error);
    return;
  }
};
