import { Sequelize } from "sequelize-typescript";

import { User } from "../models/user_model";
import { Post } from "../models/post_model";
import { Project } from "../models/project_model";
import { Category } from "../models/category_model";

const sequelizeConnection = new Sequelize({
  dialect: "postgres",
  host: process.env.PG_HOST,
  port: 5432,
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DB,
  models: [User, Post, Project, Category]
});

export default sequelizeConnection;
