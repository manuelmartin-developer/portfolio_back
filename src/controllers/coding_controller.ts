import axios from "axios";
import { Request, Response, NextFunction } from "express";

export const getCodingStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const URL = `https://wakatime.com/api/v1/users/current/stats/last_year?api_key=${process.env.WAKATIME_API_KEY}`;

    const response = await axios.get(URL);

    const stats = {
      dayly_average: response.data.data.human_readable_daily_average,
      best_day: response.data.data.best_day,
      total: response.data.data.human_readable_total_including_other_language,
      top_language: response.data.data.languages[0],
      portfolio_back: response.data.data.projects.find(
        (project: any) => project.name === "portfolio_back"
      ),
      portfolio_front: response.data.data.projects.find(
        (project: any) => project.name === "portfolio_front"
      )
    };

    res.status(200).json({ stats });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
