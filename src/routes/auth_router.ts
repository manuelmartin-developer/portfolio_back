import { Router } from "express";
import { login, verifyToken } from "../controllers/auth_controller";
import { verifyAuth } from "../middlewares/verifyAuth";

const authRouter = Router();

// Routes /auth
authRouter.post("/login", login); // /auth/login

// /auth/login
authRouter.post("/verify", verifyAuth, verifyToken); // /auth/verify

export default authRouter;
