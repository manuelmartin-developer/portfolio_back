import { Router } from "express";
import { getCodingStats } from "../controllers/coding_controller";

const codingRouter = Router();

// Routes /coding
codingRouter.get("/stats/", getCodingStats); // /coding/stats

export default codingRouter;
