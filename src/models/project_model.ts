import { Table, Model, Column, DataType, Scopes } from "sequelize-typescript";
@Scopes(() => ({
  withoutCode: {
    attributes: { exclude: ["code"] }
  }
}))
@Table({ tableName: "projects" })
export class Project extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true
  })
  code!: string;

  @Column({ type: DataType.INTEGER, autoIncrement: true, allowNull: false })
  id_project!: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  title!: string;

  @Column({ type: DataType.JSONB, allowNull: false })
  categories!: { code: number; name: string }[];

  @Column({ type: DataType.STRING, allowNull: false })
  backgroundColor!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  color!: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  isSideProject!: boolean;

  @Column({ type: DataType.STRING, allowNull: true })
  url!: string;

  @Column({ type: DataType.JSON, allowNull: true })
  paragraphs!: { content: string }[];

  @Column({ type: DataType.TEXT({ length: "tiny" }), allowNull: true })
  role!: string;

  @Column({ type: DataType.JSON, allowNull: true })
  featuredImage!: { url: string; name: string; size: number };

  @Column({ type: DataType.ARRAY(DataType.JSON), allowNull: true })
  gallery!: {
    url: string;
    name: string;
    size: number;
    width: number;
    height: number;
  }[];

  @Column({ type: DataType.JSON, allowNull: true })
  technologies!: { value: string; label: string }[];

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  isDraft!: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  hasComponent!: boolean;
}
