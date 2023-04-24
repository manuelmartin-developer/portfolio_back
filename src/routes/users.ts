import { Router } from "express";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} from "../controllers/users";

const userRouter = Router();

// CRUD Routes /users
userRouter.get("/", getUsers); // /users
userRouter.post("/", createUser); // /users
userRouter.get("/:userId", getUser); // /users/:userId
userRouter.put("/:userId", updateUser); // /users/:userId
userRouter.delete("/:userId", deleteUser); // /users/:userId

export default userRouter;
