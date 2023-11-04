import { Table, Model, Column, DataType, Scopes } from "sequelize-typescript";

@Scopes(() => ({
  withoutCode: {
    attributes: { exclude: ["code"] }
  }
}))
@Table({ tableName: "categories" })
export class Category extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true
  })
  code!: string;

  @Column({ type: DataType.INTEGER, autoIncrement: true, allowNull: false })
  id_category!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @Column({
    type: DataType.ENUM("post", "project"),
    allowNull: false,
    defaultValue: "post",
    validate: { isIn: [["post", "project"]] }
  })
  type!: string;
}
