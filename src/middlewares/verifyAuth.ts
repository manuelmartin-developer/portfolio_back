import { Request, Response, NextFunction } from "express";
const { decodeToken } = require("../utils/manageToken");

export const verifyAuth = async (
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

    next();
  } catch {
    res.status(500).json({ message: "Error en el servidor" });
  }
};
