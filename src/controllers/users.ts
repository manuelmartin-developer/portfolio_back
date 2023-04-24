import { Request, Response, NextFunction } from "express";
import { User } from "../models/user";
const { hashPassword } = require("../utils/managePass");
const { decodeToken } = require("../utils/manageToken");

// get all users
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.headers.authorization) {
      res
        .status(403)
        .json({ message: "No tienes permisos para acceder a esta ruta" });
      return;
    }

    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = await decodeToken(token);
    if (!decodedToken) {
      res
        .status(403)
        .json({ message: "No tienes permisos para acceder a esta ruta" });
      return;
    }
    const { role } = decodedToken;

    if (role !== "admin") {
      res
        .status(403)
        .json({ message: "No tienes permisos para acceder a esta ruta" });
      return;
    }

    const users = await User.scope("withoutPassword").findAll();

    res.status(200).json({ message: "Usuarios registrados", users: users });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// get a single user by id
export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.params.userId) {
      res.status(400).json({ message: "El id de usuario es requerido" });
      return;
    }
    if (!req.headers.authorization) {
      res
        .status(403)
        .json({ message: "No tienes permisos para acceder a esta ruta" });
      return;
    }

    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = await decodeToken(token);

    if (!decodedToken) {
      res
        .status(403)
        .json({ message: "No tienes permisos para acceder a esta ruta" });
      return;
    }
    const { role, id } = decodedToken;

    if (role !== "admin" && id !== Number(req.params.userId)) {
      res
        .status(403)
        .json({ message: "No tienes permisos para acceder a esta ruta" });
      return;
    }

    const existingUser = await User.scope("withoutPassword").findByPk(
      req.params.userId
    );

    if (!existingUser) {
      res.status(404).json({ message: "No se ha encontrado el usuario" });
      return;
    }

    res.status(200).json({ message: "Usuario encontrado", user: existingUser });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// create a user
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.headers.authorization) {
      res
        .status(403)
        .json({ message: "No tienes permisos para acceder a esta ruta" });
      return;
    }

    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = await decodeToken(token);
    if (!decodedToken) {
      res
        .status(403)
        .json({ message: "No tienes permisos para acceder a esta ruta" });
      return;
    }

    const userRole = decodedToken.role;

    if (userRole !== "admin") {
      res
        .status(403)
        .json({ message: "No tienes permisos para acceder a esta ruta" });
      return;
    }

    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: "Todos los campos son requeridos" });
      return;
    }

    const existingUser = await User.scope("withoutPassword").findOne({
      where: { email: email }
    });

    if (existingUser) {
      res.status(400).json({ message: "El usuario ya existe" });
      return;
    }

    const newUser = await User.create({
      name,
      email,
      password: await hashPassword(password),
      role
    });

    if (!newUser) {
      res.status(500).json({ message: "No se ha podido crear el usuario" });
      return;
    }

    res.status(201).json({ message: "Usuario creado", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// update a user

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.params.userId) {
      res.status(400).json({ message: "El id del usuario es requerido" });
      return;
    }

    if (!req.headers.authorization) {
      res
        .status(403)
        .json({ message: "No tienes permisos para acceder a esta ruta" });
      return;
    }

    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = await decodeToken(token);

    if (!decodedToken) {
      res
        .status(403)
        .json({ message: "No tienes permisos para acceder a esta ruta" });
      return;
    }
    const { role, id } = decodedToken;

    if (role !== "admin" && id !== Number(req.params.userId)) {
      res
        .status(403)
        .json({ message: "No tienes permisos para acceder a esta ruta" });
      return;
    }

    const { name, role: newRole, password } = req.body;

    const existingUser = await User.findByPk(req.params.userId);

    if (!existingUser) {
      res.status(404).json({ message: "No se ha encontrado el usuario" });
      return;
    }

    if (role !== "admin" && newRole) {
      res
        .status(403)
        .json({ message: "No tienes permisos para acceder a esta ruta" });
      return;
    }

    const updatedUser = await existingUser.update({
      name: name ? name : existingUser.name,
      password: password ? await hashPassword(password) : existingUser.password,
      role: newRole
    });

    if (!updatedUser) {
      res
        .status(500)
        .json({ message: "No se ha podido actualizar el usuario" });
      return;
    }

    res.status(200).json({ message: "Usuario actualizado", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// delete a user
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.params.userId) {
      res.status(400).json({ message: "El id del usuario es requerido" });
      return;
    }

    if (!req.headers.authorization) {
      res
        .status(403)
        .json({ message: "No tienes permisos para acceder a esta ruta" });
      return;
    }

    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = await decodeToken(token);

    if (!decodedToken) {
      res
        .status(403)
        .json({ message: "No tienes permisos para acceder a esta ruta" });
      return;
    }
    const { role, id } = decodedToken;

    if (role !== "admin" && id !== Number(req.params.userId)) {
      res
        .status(403)
        .json({ message: "No tienes permisos para acceder a esta ruta" });
      return;
    }

    if (role === "admin" && id === Number(req.params.userId)) {
      res.status(403).json({
        message:
          "No puedes eliminar tu usuario desde este medio. Accede a la base de datos."
      });
      return;
    }

    const existingUser = await User.findByPk(req.params.userId);

    if (!existingUser) {
      res.status(404).json({ message: "No se ha encontrado el usuario" });
      return;
    }

    const deletedUser = await existingUser.destroy();

    if (deletedUser === null) {
      res.status(500).json({ message: "No se ha podido eliminar el usuario" });
      return;
    }

    res.status(200).json({ message: "Usuario eliminado", user: deletedUser });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};
