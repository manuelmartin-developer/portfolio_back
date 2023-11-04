import { Router } from "express";
import { verifyAuth } from "../middlewares/verifyAuth";
import {
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory
} from "../controllers/categories_controller";

const categoriesRouter = Router();

// CRUD Routes /categories
categoriesRouter.get("/", getCategories); // /categories
categoriesRouter.post("/", verifyAuth, createCategory); // /categories
categoriesRouter.put("/:code/", verifyAuth, updateCategory); // /categories/:code
categoriesRouter.delete("/:code/", verifyAuth, deleteCategory); // /categories/:code

export default categoriesRouter;
