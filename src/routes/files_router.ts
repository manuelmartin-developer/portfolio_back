import { Router } from "express";
import { verifyAuth } from "../middlewares/verifyAuth";
import {
  deleteFile,
  getFiles,
  uploadFiles
} from "../controllers/files_controller";

const filesRouter = Router();

// CRUD Routes /files
filesRouter.get("/:entityType/:code/", verifyAuth, getFiles); // /files/:entityType/:code/
filesRouter.post("/:entityType/:code/", verifyAuth, uploadFiles); // /files/:entityType/:code/
filesRouter.delete("/:entityType/:code/", verifyAuth, deleteFile); // /files/:entityType/:code/

export default filesRouter;
