import { Request, Response, NextFunction } from "express";
import axios from "axios";

const login = async () => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const config = {
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded"
    }
  };
  const body = "grant_type=client_credentials";
  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    body,
    config
  );
  return response.data.access_token;
};

export const getSong = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = await login();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const response = await axios.get(
      `https://api.spotify.com/v1/playlists/${process.env.SPOTIFY_PLAYLIST_ID}`,
      config
    );
    const playlist = response.data;
    const randomIndex = Math.floor(
      Math.random() * playlist.tracks.items.length
    );
    const randomTrack = playlist.tracks.items[randomIndex].track;

    res.status(200).json({ song: randomTrack });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
