import { Router } from "express";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} from "../controllers/users";
import { verifyAuth } from "../middlewares/verifyAuth";

const userRouter = Router();

// CRUD Routes /users
userRouter.get("/", verifyAuth, getUsers); // /users
userRouter.post("/", verifyAuth, createUser); // /users
userRouter.get("/:userId", verifyAuth, getUser); // /users/:userId
userRouter.put("/:userId", verifyAuth, updateUser); // /users/:userId
userRouter.delete("/:userId", verifyAuth, deleteUser); // /users/:userId

export default userRouter;
