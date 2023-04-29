require("dotenv").config();
import express, { Application, Request, Response, NextFunction } from "express";
import { WebSocketServer } from "ws";
import morgan from "morgan";
import sequelizeConnection from "./utils/database";
import authRouter from "./routes/auth";
import usersRouter from "./routes/users";
import fakeRouter from "./routes/fake";
import { log, black, white, cyan } from "console-log-colors";
import cors from "cors";
import si from "systeminformation";

const swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("../swagger.json");

// Express app
const app: Application = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true
  })
);
const corsOpts = {
  origin: [
    "https://www.manuelmartin.dev",
    "https://manuelmartin.dev",
    "http://localhost:3000"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

(async () => {
  const cpu = await si.currentLoad();
  console.log("avgLoad", cpu.avgLoad);
  console.log("currentLoad", cpu.currentLoad);
  console.log("currentLoadIdle", cpu.currentLoadIdle);

  const mem = await si.mem();
  console.log(mem.total / 1024 / 1024 / 1024);
  console.log(mem.active / 1024 / 1024 / 1024);
  console.log(mem.available / 1024 / 1024 / 1024);

  const fsSize = await si.fsSize();
  console.log(fsSize[0].size / 1024 / 1024 / 1024);
  console.log(fsSize[0].available / 1024 / 1024 / 1024);

  const inetChecksite = await si.inetChecksite(
    `${process.env.API_BASE_URL}${process.env.API_BASE_PATH}`
  );
  console.log(inetChecksite);
})();

// Middlewares
app.use(cors(corsOpts));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms", {
    stream: {
      write: (message) => {
        log(message, "cyan");
      }
    }
  })
);
app.use(express.static("public"));

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

// Websocket server
const wsServer = new WebSocketServer({
  port: Number(process.env.WS_PORT) || 8081
});
wsServer.on("connection", (socket) => {
  let CPUInterval: NodeJS.Timeout | null = null;
  let RAMInterval: NodeJS.Timeout | null = null;
  let DISKInterval: NodeJS.Timeout | null = null;
  socket.on("message", (message) => {
    console.log(black.bgYellow("WS Message Received: " + message));

    if (message.toString() === "STOP") {
      CPUInterval && clearInterval(CPUInterval);
      RAMInterval && clearInterval(RAMInterval);
      DISKInterval && clearInterval(DISKInterval);
    }
    if (message.toString() === "CPU") {
      RAMInterval && clearInterval(RAMInterval);
      DISKInterval && clearInterval(DISKInterval);

      CPUInterval = setInterval(async () => {
        const cpu = await si.currentLoad();
        const cpuData = {
          avgLoad: cpu.avgLoad,
          currentLoad: cpu.currentLoad,
          currentLoadIdle: cpu.currentLoadIdle
        };
        socket.send(`CPU: ${JSON.stringify(cpuData)}`);
      }, 1000);
    }
    if (message.toString() === "RAM") {
      CPUInterval && clearInterval(CPUInterval);
      DISKInterval && clearInterval(DISKInterval);

      RAMInterval = setInterval(async () => {
        const mem = await si.mem();
        const memData = {
          total: mem.total / 1024 / 1024 / 1024,
          active: mem.active / 1024 / 1024 / 1024,
          available: mem.available / 1024 / 1024 / 1024
        };
        socket.send(`RAM: ${JSON.stringify(memData)}`);
      }, 1000);
    }

    if (message.toString() === "DISK") {
      CPUInterval && clearInterval(CPUInterval);
      RAMInterval && clearInterval(RAMInterval);

      DISKInterval = setInterval(async () => {
        const fsSize = await si.fsSize();
        const fsSizeData = {
          size: fsSize[0].size / 1024 / 1024 / 1024,
          available: fsSize[0].available / 1024 / 1024 / 1024
        };
        socket.send(`DISK: ${JSON.stringify(fsSizeData)}`);
      }, 1000);
    }
  });
  socket.send("Connected to WS server");
});
