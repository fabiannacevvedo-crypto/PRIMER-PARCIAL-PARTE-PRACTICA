import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  "gestion_proyectos", // nombre de la BD
  "root",              // usuario
  "",                  // contraseña vacía
  {
    host: "localhost",
    port: 3306,
    dialect: "mysql",
    logging: false,
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión exitosa a la base de datos");

    await sequelize.sync();

    console.log("Modelos sincronizados");
  } catch (error) {
    console.error("Error al conectar:", error);
  }
};