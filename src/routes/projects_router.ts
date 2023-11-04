import { Router } from "express";

import { verifyAuth } from "../middlewares/verifyAuth";
import {
  getAdminProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getProjects,
  getProjectByTitle,
  getProjectTitles
} from "../controllers/projects_controller";

const projectsRouter = Router();

// CRUD Routes /projects
projectsRouter.get("/", getProjects); // /projects
projectsRouter.get("/titles/:title/", getProjectByTitle); // /projects/:title
projectsRouter.get("/titles/", getProjectTitles); // /projects/titles
projectsRouter.get("/admin", verifyAuth, getAdminProjects); // /projects/admin
projectsRouter.post("/", verifyAuth, createProject); // /projects
projectsRouter.get("/:code", getProject); // /projects/:code
projectsRouter.get("/admin/:code", verifyAuth, getProject); // /projects/:code
projectsRouter.put("/:code", verifyAuth, updateProject); // /projects/:code
projectsRouter.delete("/:code", verifyAuth, deleteProject); // /projects/:code

export default projectsRouter;
