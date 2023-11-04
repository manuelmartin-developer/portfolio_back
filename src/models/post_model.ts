import { Table, Model, Column, DataType, Scopes } from "sequelize-typescript";

@Scopes(() => ({
  withoutCode: {
    attributes: { exclude: ["code"] }
  }
}))
@Table({ tableName: "posts" })
export class Post extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true
  })
  code!: string;

  @Column({ type: DataType.INTEGER, autoIncrement: true, allowNull: false })
  id_post!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  title!: string;

  @Column({
    type: DataType.TEXT({
      length: "tiny"
    }),
    allowNull: false
  })
  excerpt!: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  content!: string;

  @Column({ type: DataType.JSON, allowNull: true })
  featuredImage!: { url: string; name: string; size: number };

  @Column({ type: DataType.JSON, allowNull: true })
  gallery!: { url: string; name: string; size: number }[];

  @Column({ type: DataType.JSONB, allowNull: true })
  categories!: { value: number; label: string }[];

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  isDraft!: boolean;

  @Column({ type: DataType.STRING, allowNull: false })
  slug!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  author!: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0, allowNull: false })
  likes!: number;
}
