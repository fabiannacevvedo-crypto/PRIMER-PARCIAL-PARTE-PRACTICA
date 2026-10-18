// * ARCHIVO A COMPLETAR
import { body } from "express-validator";
import {
  ProjectModel,
  TechnologyModel,
  UserModel,
} from "../../models/index.js";

export const createProjectValidation = [
  // TODO: 1. Validar code: obligatorio y único (ProjectModel).
  body("code")
    .notEmpty()
    .withMessage("El código es obligatorio")
    .custom(async (code) => {
      const project = await ProjectModel.findOne({ where: { code } });

      if (project) {
        throw new Error("El código ya existe");
      }

      return true;
    }),

  // TODO: 2. Validar name y description como obligatorios.
  body("name")
    .notEmpty()
    .withMessage("El nombre es obligatorio"),

  body("description")
    .notEmpty()
    .withMessage("La descripción es obligatoria"),

  // TODO: 3. Validar status: opcional y limitado a los estados permitidos.
  body("status")
    .optional()
    .isIn(["pending", "active", "completed"])
    .withMessage("Estado inválido"),

  // TODO: 4. Validar start_date como fecha válida y budget como número positivo, ambos obligatorios.
  body("start_date")
    .notEmpty()
    .withMessage("La fecha de inicio es obligatoria")
    .isDate()
    .withMessage("La fecha de inicio debe ser válida"),

  body("budget")
    .notEmpty()
    .withMessage("El presupuesto es obligatorio")
    .isFloat({ gt: 0 })
    .withMessage("El presupuesto debe ser un número positivo"),

  // TODO: 5. Validar leader_id: debe existir y pertenecer a un usuario activo (UserModel).
  body("leader_id")
    .notEmpty()
    .withMessage("El líder es obligatorio")
    .custom(async (leader_id) => {
      const user = await UserModel.findByPk(leader_id);

      if (!user) {
        throw new Error("El líder no existe");
      }

      return true;
    }),

  // TODO: 6. Validar technologies: lista de ids que existan (TechnologyModel).
  body("technologies")
    .isArray()
    .withMessage("Las tecnologías deben ser una lista")
    .custom(async (technologies) => {
      for (const technologyId of technologies) {
        const technology = await TechnologyModel.findByPk(technologyId);

        if (!technology) {
          throw new Error(
            `La tecnología con id ${technologyId} no existe`
          );
        }
      }

      return true;
    }),

  // ? Un usuario eliminado lógicamente no puede ser líder: comprobar que la búsqueda lo deje afuera.
];

export const updateProjectValidation = [
  // TODO: 7. Validar code como opcional y único, excluyendo el propio proyecto que se edita.
  body("code")
    .optional()
    .custom(async (code, { req }) => {
      const { id } = req.params;

      const project = await ProjectModel.findOne({
        where: { code },
      });

      if (project && project.id !== Number(id)) {
        throw new Error("El código ya existe");
      }

      return true;
    }),

  // TODO: 8. Validar name y description como opcionales y no vacíos.
  body("name")
    .optional()
    .notEmpty()
    .withMessage("El nombre no puede estar vacío"),

  body("description")
    .optional()
    .notEmpty()
    .withMessage("La descripción no puede estar vacía"),

  // TODO: 9. Validar status, start_date y budget como opcionales, con las mismas reglas que al crear.
  body("status")
    .optional()
    .isIn(["pending", "active", "completed"])
    .withMessage("Estado inválido"),

  body("start_date")
    .optional()
    .isDate()
    .withMessage("La fecha de inicio debe ser válida"),

  body("budget")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("El presupuesto debe ser un número positivo"),

  // TODO: 10. Validar leader_id como opcional, existente y de un usuario activo.
  body("leader_id")
    .optional()
    .custom(async (leader_id) => {
      const user = await UserModel.findByPk(leader_id);

      if (!user) {
        throw new Error("El líder no existe");
      }

      return true;
    }),

  // TODO: 11. Validar technologies como opcional, con ids que existan.
  body("technologies")
    .optional()
    .isArray()
    .withMessage("Las tecnologías deben ser una lista")
    .custom(async (technologies) => {
      for (const technologyId of technologies) {
        const technology = await TechnologyModel.findByPk(technologyId);

        if (!technology) {
          throw new Error(
            `La tecnología con id ${technologyId} no existe`
          );
        }
      }

      return true;
    }),

  // ? Para saber qué proyecto se edita, el id se obtiene de los parámetros de la ruta (req.params).
];