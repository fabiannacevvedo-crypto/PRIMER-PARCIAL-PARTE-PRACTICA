// * ARCHIVO A COMPLETAR
import { body } from "express-validator";
import { UserModel, ProfileModel } from "../../models/index.js";

export const registerValidation = [
  // TODO: 1. Validar username: obligatorio, entre 3 y 20 caracteres y único (UserModel).
  body("username")
    .notEmpty()
    .withMessage("El username es obligatorio")
    .isLength({ min: 3, max: 20 })
    .withMessage("El username debe tener entre 3 y 20 caracteres")
    .custom(async (username) => {
      const user = await UserModel.findOne({ where: { username } });

      if (user) {
        throw new Error("El username ya existe");
      }

      return true;
    }),

  // TODO: 2. Validar email: obligatorio, con formato válido y único.
  body("email")
    .notEmpty()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("Formato de email inválido")
    .custom(async (email) => {
      const user = await UserModel.findOne({ where: { email } });

      if (user) {
        throw new Error("El email ya existe");
      }

      return true;
    }),

  // TODO: 3. Validar password: obligatoria, con mínimo de 8 caracteres.
  body("password")
    .notEmpty()
    .withMessage("La password es obligatoria")
    .isLength({ min: 8 })
    .withMessage("La password debe tener al menos 8 caracteres"),

  // TODO: 4. Validar role: opcional y limitado a los roles permitidos.
  body("role")
    .optional()
    .isIn(["administrator", "leader"])
    .withMessage("Rol inválido"),

  // TODO: 5. Validar profile.employee_number: obligatorio y único (ProfileModel).
  body("profile.employee_number")
    .notEmpty()
    .withMessage("El número de empleado es obligatorio")
    .custom(async (employee_number) => {
      const profile = await ProfileModel.findOne({
        where: { employee_number },
      });

      if (profile) {
        throw new Error("El número de empleado ya existe");
      }

      return true;
    }),

  // TODO: 6. Validar profile.first_name y profile.last_name como obligatorios, y profile.phone como opcional.
  body("profile.first_name")
    .notEmpty()
    .withMessage("El nombre es obligatorio"),

  body("profile.last_name")
    .notEmpty()
    .withMessage("El apellido es obligatorio"),

  body("profile.phone")
    .optional(),
];

// ? Las unicidades requieren una validación personalizada asíncrona.

export const loginValidation = [
  // TODO: 7. Validar email: obligatorio y con formato válido.
  body("email")
    .notEmpty()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("Formato de email inválido"),

  // TODO: 8. Validar password: obligatoria.
  body("password")
    .notEmpty()
    .withMessage("La password es obligatoria"),
];