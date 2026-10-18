import { matchedData } from "express-validator";
import {
  ProjectModel,
  ProjectTechnologyModel,
  TechnologyModel,
  UserModel,
} from "../models/index.js";

export const createProject = async (req, res) => {
  try {
    const validatedDataBody = matchedData(req, { locations: ["body"] });

    const { technologies = [], ...projectData } = validatedDataBody;

    const project = await ProjectModel.create({
      ...projectData,
      leaderId: req.user.id,
    });

    if (technologies.length > 0) {
      const techs = await TechnologyModel.findAll({
        where: {
          id: technologies,
        },
      });

      await project.setTechnologies(techs);
    }

    const projectCreated = await ProjectModel.findByPk(project.id, {
      include: [
        {
          model: UserModel,
          as: "leader",
          attributes: {
            exclude: ["password"],
          },
        },
        {
          model: TechnologyModel,
          as: "technologies",
          through: {
            attributes: [],
          },
        },
      ],
    });

    return res.status(201).json(projectCreated);

    // TODO: 1. Crear el project con los datos del body que ya pasaron la validación.
    // ? Revisar de dónde debe salir el leader del proyecto.
    // TODO: 2. Asociar al project las technologies recibidas.
    // TODO: 3. Responder con código 201 y el project con sus technologies y su leader.
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const getAllProjects = async (_req, res) => {
  try {
    const projects = await ProjectModel.findAll({
      include: [
        {
          model: UserModel,
          as: "leader",
          attributes: {
            exclude: ["password"],
          },
        },
        {
          model: TechnologyModel,
          as: "technologies",
          through: {
            attributes: [],
          },
        },
      ],
    });

    return res.status(200).json(projects);

    // TODO: 1. Listar todos los projects incluyendo su leader (sin la password) y sus technologies, y responder con código 200 y los projects..
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const getMyProjects = async (req, res) => {
  try {
    const projects = await ProjectModel.findAll({
      where: {
        leaderId: req.user.id,
      },
      include: [
        {
          model: TechnologyModel,
          as: "technologies",
          through: {
            attributes: [],
          },
        },
      ],
    });

    return res.status(200).json(projects);

    // TODO: 1. Listar los projects cuyo leader sea el usuario logueado, incluyendo sus technologies, y responder con código 200 y los projects.
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const updateProject = async (req, res) => {
  try {
    const validatedDataBody = matchedData(req, { locations: ["body"] });
    const { id } = matchedData(req, { locations: ["params"] });

    const projectExist = await ProjectModel.findByPk(id);

    if (!projectExist) {
      return res.status(404).json({ message: "proyecto no encontrado" });
    }

    await projectExist.update(validatedDataBody);

    if (validatedDataBody.technologies) {
      const techs = await TechnologyModel.findAll({
        where: {
          id: validatedDataBody.technologies,
        },
      });

      await projectExist.setTechnologies(techs);
    }

    const updatedProject = await ProjectModel.findByPk(projectExist.id, {
      include: [
        {
          model: UserModel,
          as: "leader",
          attributes: {
            exclude: ["password"],
          },
        },
        {
          model: TechnologyModel,
          as: "technologies",
          through: {
            attributes: [],
          },
        },
      ],
    });

    return res.status(200).json(updatedProject);

    // TODO: 1. Actualizar el project con los datos recibidos.
    // TODO: 2. Reemplazar sus technologies si vienen en el body.
    // TODO: 3. Responder con código 200 y el project actualizado, incluyendo su leader y sus technologies.
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(id);

    const projectExist = await ProjectModel.findByPk(id);

    if (!projectExist) {
      return res.status(404).json({ message: "proyecto no encontrado" });
    }

    await projectExist.destroy();

    return res.status(204).send();

    // TODO: 1. Eliminar el project y responder con código 204 sin devolver ningún mensaje.
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
};