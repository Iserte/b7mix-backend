import { DataSource } from "typeorm";

const defaultDataSource = new DataSource({
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT as unknown as number,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  entities: [__dirname + "/entity/*.entity.{js,ts}"],
  migrations: [__dirname + "/migration/*.{js,ts}"],
  synchronize: true
});

export default defaultDataSource;
