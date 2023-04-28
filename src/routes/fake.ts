import { Router } from "express";

const fakeRouter = Router();

// CRUD Routes /fake
fakeRouter.get("/", (req, res) => {
  res.send("GET /fake");
}); // /fake
fakeRouter.post("/", (req, res) => {
  setTimeout(() => {
    res.send("POST /fake");
  }, 2000);
}); // /fake

export default fakeRouter;
