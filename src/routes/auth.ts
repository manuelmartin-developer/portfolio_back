import { Router } from "express";
import { login, verifyToken } from "../controllers/auth";

const authRouter = Router();

// Routes /auth
authRouter.post("/login", login); // /auth/login

// /auth/login
authRouter.post("/verify", verifyToken); // /auth/verify

export default authRouter;
