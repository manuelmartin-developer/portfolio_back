require("dotenv").config({ path: "./.env/.env" });
import express, { Application, Request, Response, NextFunction } from "express";
import morgan from "morgan";

import bodyparser from "body-parser";
import sequelizeConnection from "./utils/database";
import authRouter from "./routes/auth";
import usersRouter from "./routes/users";
import fakeRouter from "./routes/fake";
const { log, black, white, cyan } = require("console-log-colors");
const cors = require("cors");

const swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("../swagger.json");

// Express app
const app: Application = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
const corsOpts = {
  origin: [
    "https://www.manuelmartin.dev",
    "https://manuelmartin.dev",
    "92.189.35.223"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

// Middlewares
app.use(cors(corsOpts));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms", {
    stream: {
      write: (message) => {
        log(cyan(message));
      }
    }
  })
);
app.use(express.static("public"));

//test route
app.get(
  process.env.API_BASE_PATH || "/api/v1",
  (req: Request, res: Response) => {
    res.send("API status: OK");
  }
);

//CRUD routes
app.use(`${process.env.API_BASE_PATH}/users`, usersRouter);
app.use(`${process.env.API_BASE_PATH}/auth`, authRouter);
app.use(`${process.env.API_BASE_PATH}/fake`, fakeRouter);

// Swagger docs
app.use(
  `${process.env.API_BASE_PATH}/docs`,
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

//error handling
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.log(cyan.bgRed("Error: " + error.message));
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

//sync database
sequelizeConnection
  .sync()
  .then((result: any) => {
    console.log(black.bgGreen("Database connected"));
    app.listen(process.env.PORT || 8080, () => {
      console.log(black.bgGreen(`Server started on port ${process.env.PORT}`));
    });
  })
  .catch((err: any) =>
    console.log(white.bgRed("Error in database connection --> " + err))
  );
