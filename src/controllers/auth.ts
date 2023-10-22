import e, { Request, Response, NextFunction } from "express";
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
  try {
    const token = await req.body.token;
    if (!token) {
      res.status(400).json({ message: "El token es requerido" });
      return;
    }
    const JWTRegex =
      /^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-\+\/=]*)/gm;

    if (!JWTRegex.test(token)) {
      res.status(400).json({ message: "El token no es correcto" });
      return;
    }
    const decodedToken = await decodeToken(token);

    if (!decodedToken) {
      res.status(401).json({ message: "Token incorrecto" });
      return;
    }

    const { id } = decodedToken;

    if (!id) {
      res.status(401).json({ message: "Token incorrecto" });
      return;
    }

    const existingUser = await User.findOne({ where: { id: id } });

    if (!existingUser) {
      res.status(404).json({ message: "No se ha encontrado el usuario" });
      return;
    }

    const isAdmin = (await existingUser.getDataValue("role")) === "admin";

    if (!isAdmin) {
      res.status(401).json({ message: "No tienes permisos para esta ruta" });
      return;
    }

    res.status(200).json({ message: "Bienvenido Admin!!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
