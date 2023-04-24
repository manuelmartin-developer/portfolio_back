import {
  Table,
  Model,
  Column,
  DataType,
  Scopes,
  DefaultScope
} from "sequelize-typescript";

@Scopes(() => ({
  withoutPassword: {
    attributes: { exclude: ["password"] }
  }
}))
@Table({ tableName: "users" })
export class User extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password!: string;

  @Column({ type: DataType.STRING, allowNull: false, defaultValue: "user" })
  role!: string;
}
