import { Router } from "express";
import { getSong } from "../controllers/spotify_controller";

const spotifyRouter = Router();

spotifyRouter.get("/song/", getSong);

export default spotifyRouter;
