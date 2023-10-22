import { Router } from "express";
import { login, verifyToken } from "../controllers/auth";
import { verifyAuth } from "../middlewares/verifyAuth";

const authRouter = Router();

// Routes /auth
authRouter.post("/login", login); // /auth/login

// /auth/login
authRouter.post("/verify", verifyAuth, verifyToken); // /auth/verify

export default authRouter;
