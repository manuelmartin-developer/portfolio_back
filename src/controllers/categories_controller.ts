import { Request, Response, NextFunction } from "express";
import { Category } from "../models/category_model";
import { white } from "console-log-colors";

// get all categories
export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { type } = req.query;
    const categories = await Category.findAll(
      type
        ? { where: { type }, order: [["name", "ASC"]] }
        : {
            order: [["name", "ASC"]]
          }
    );

    res.status(200).json({ message: "Categorias registradas", categories });
  } catch (error) {
    console.log(white.bgRed("Error: " + error));
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// create a category
export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, type } = req.body;

    if (!name || !type) {
      res.status(400).json({ message: "El nombre y el tipo son requeridos" });
      return;
    }

    const existingCategory = await Category.findOne({
      where: { name: name, type: type }
    });

    if (existingCategory) {
      res.status(400).json({ message: "La categoria ya existe" });
      return;
    }

    const newCategory = await Category.create({ name, type });

    if (!newCategory) {
      res.status(500).json({ message: "No se ha podido crear la categoria" });
      return;
    }

    const categories = await Category.findAll({ order: [["name", "ASC"]] });

    res.status(201).json({ message: "Categoria creada", categories });
  } catch (error) {
    console.log(white.bgRed("Error: " + error));
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// update a category
export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { code } = req.params;
    const { name, type } = req.body;

    if (!code) {
      res.status(400).json({ message: "El id de categoria es requerido" });
      return;
    }

    const existingCategory = await Category.findByPk(code);

    if (!existingCategory) {
      res.status(404).json({ message: "Categoria no encontrada" });
      return;
    }

    await existingCategory.update({ name, type });

    const categories = await Category.findAll({ order: [["name", "ASC"]] });

    res.status(200).json({ message: "Categoria actualizada", categories });
  } catch (error) {
    console.log(white.bgRed("Error: " + error));
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// delete a category
export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { code } = req.params;

    if (!code) {
      res.status(400).json({ message: "El id de categoria es requerido" });
      return;
    }

    const existingCategory = await Category.findByPk(code);

    if (!existingCategory) {
      res.status(404).json({ message: "Categoria no encontrada" });
      return;
    }

    await existingCategory.destroy();

    const categories = await Category.findAll({ order: [["name", "ASC"]] });

    res.status(200).json({ message: "Categoria eliminada", categories });
  } catch (error) {
    console.log(white.bgRed("Error: " + error));
    res.status(500).json({ message: "Error en el servidor" });
  }
};
