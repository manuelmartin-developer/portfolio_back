import { Table, Model, Column, DataType, Scopes } from "sequelize-typescript";

@Scopes(() => ({
  withoutPassword: {
    attributes: { exclude: ["password"] }
  }
}))
@Table({ tableName: "users" })
export class User extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true
  })
  code!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: "user",
    validate: {
      isIn: [["user", "admin"]]
    }
  })
  role!: string;
}
