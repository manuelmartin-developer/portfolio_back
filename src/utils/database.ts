import { Sequelize } from "sequelize-typescript";

import { User } from "../models/user";

const sequelizeConnection = new Sequelize({
  dialect: "postgres",
  host: process.env.PG_HOST,
  port: 5432,
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DB,
  models: [User]
});

export default sequelizeConnection;
