import { Request, Response, NextFunction } from "express";
import { Project } from "../models/project_model";
import { deleteAllProjectFiles } from "./files_controller";
import { Op } from "sequelize";
import { white } from "console-log-colors";

// get all projects
export const getAdminProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const projects = await Project.findAll({
      order: [["id_project", "ASC"]]
    });

    if (!projects) {
      res.status(204).json({ message: "No hay projectos" });
      return;
    }
    res.status(200).json({ message: "Projects", projects });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const getProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id_category } = req.query;

    const projects = await Project.scope("withoutCode").findAll({
      where: {
        isDraft: false,
        ...(id_category && {
          categories: {
            [Op.contains]: [
              {
                code: Number(id_category)
              }
            ]
          }
        })
      }
    });

    res.status(200).json({ message: "Projects", projects: projects });
  } catch (error) {
    console.log(white.bgRed("Error: " + error));
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// get a single project by code
export const getProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.params.code) {
      res.status(400).json({ message: "El id del proyecto es requerido" });
      return;
    }
    const existingProject = await Project.findByPk(req.params.code);

    if (!existingProject) {
      res.status(404).json({ message: "Proyecto no encontrado" });
      return;
    }

    res.status(200).json({ message: "Proyecto", project: existingProject });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// get a single project by title
export const getProjectByTitle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title } = req.params;
    if (!title) {
      res.status(400).json({ message: "El titulo del proyecto es requerido" });
      return;
    }

    const existingProject = await Project.findOne({
      where: {
        title: {
          [Op.iLike]: title
        }
      }
    });

    if (!existingProject) {
      res.status(404).json({ message: "Proyecto no encontrado" });
      return;
    }

    res.status(200).json({ message: "Proyecto", project: existingProject });
  } catch (error) {
    console.log(white.bgRed("Error: " + error));
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// get all project titles
export const getProjectTitles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const projects = await Project.findAll({
      attributes: ["title"]
    });

    res.status(200).json({ message: "Projects", projects });
  } catch (error) {
    console.log(white.bgRed("Error: " + error));
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// create a project
export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const project = await Project.create({
      title: "",
      categories: [],
      backgroundColor: "",
      color: "",
      isSideProject: false,
      url: "",
      paragraphs: [],
      role: "",
      featuredImage: null,
      gallery: [],
      technologies: [],
      isDraft: true,
      hasComponent: false
    });

    res.status(201).json({ message: "Proyecto creado", project: project });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// update a project
export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.params.code) {
      res.status(400).json({ message: "El id del proyecto es requerido" });
      return;
    }

    const existingProject = await Project.findByPk(req.params.code);

    if (!existingProject) {
      res.status(404).json({ message: "Proyecto no encontrado" });
      return;
    }

    await existingProject.update(req.body);

    res
      .status(200)
      .json({ message: "Proyecto actualizado", project: existingProject });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// delete a project
export const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.params.code) {
      res.status(400).json({ message: "El id del proyecto es requerido" });
      return;
    }

    const existingProject = await Project.findByPk(req.params.code);

    if (!existingProject) {
      res.status(404).json({ message: "Proyecto no encontrado" });
      return;
    }

    await deleteAllProjectFiles(req.params.code);

    await existingProject.destroy();

    const projects = await Project.findAll();

    res.status(200).json({ message: "Proyecto eliminado", projects: projects });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
