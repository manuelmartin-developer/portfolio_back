import { Request, Response, NextFunction } from "express";
import { User } from "../models/user";
import { verifyPassword } from "../utils/managePass";
import { generateToken, decodeToken } from "../utils/manageToken";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body) {
      res.status(400).json({ message: "No se han enviado datos" });
      return;
    }
    const data = await req.body;
    const { email, password } = data;

    if (!email || !password) {
      res.status(400).json({ message: "Email y password son requeridos" });
      return;
    }

    const existingUser = await User.findOne({ where: { email: email } });

    if (!existingUser) {
      res
        .status(403)
        .json({ message: "No existe ningun usuario con ese email" });
      return;
    }

    const isValid = await verifyPassword(
      password,
      existingUser.getDataValue("password")
    );

    if (!isValid) {
      res.status(403).json({ message: "Contraseña incorrecta" });
      return;
    }

    const token = await generateToken(
      existingUser.getDataValue("id"),
      existingUser.getDataValue("email"),
      existingUser.getDataValue("role")
    );

    res.status(200).json({
      message: "Login correcto",
      token: token,
      isAdmin: existingUser.getDataValue("role") === "admin"
    });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // TODO - review this function
  try {
    const headerToken = req.headers.authorization?.split(" ")[1];
    if (!headerToken) {
      res
        .status(403)
        .json({ message: "No tiene permisos para acceder a esta ruta" });
      return;
    }
    const decodedToken = await decodeToken(headerToken);

    if (!decodedToken) {
      res.status(403).json({ message: "Token incorrecto" });
      return;
    }
    const { role: headerRole } = decodedToken;

    const bodyToken = await req.body.token;

    if (!bodyToken) {
      res.status(400).json({ message: "El token es requerido" });
      return;
    }

    if (!bodyToken.startsWith("ey")) {
      res.status(400).json({ message: "El token es incorrecto" });
      return;
    }

    const decodedBodyToken = await decodeToken(bodyToken);

    if (!decodedBodyToken) {
      res.status(403).json({ message: "Token incorrecto" });
      return;
    }

    if (headerToken !== bodyToken && headerRole !== "admin") {
      res
        .status(403)
        .json({ message: "No tienes permisos para acceder a esta ruta" });
      return;
    }

    res.status(200).json({
      message: "Token correcto",
      id: decodedBodyToken.id,
      email: decodedBodyToken.email,
      role: decodedBodyToken.role
    });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};
