import express from "express";
import { sequelize } from "./src/config/database.js";
import { UserModel } from "./src/models/user.model.js";
import { ProfileModel } from "./src/models/profile.model.js";
import ProjectTechnologyMode from "./src/models/project.model.js"
import { ProjectModel } from "./src/models/project.model.js";
import { ProjectTechnologyModel } from "./src/models/project_technology.model.js";
import TechnologyModel from "./src/models/technology.model.js"

const app = express();

const PORT = 3000;

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Base de datos conectada");

        // Opcional: sincronizar modelos
        await sequelize.sync();

    } catch (error) {
        console.error("Error al conectar la BD:", error);
    }
};

app.listen(PORT, async () => {
    await connectDB();
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
