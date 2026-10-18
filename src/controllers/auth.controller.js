import { UserModel, ProfileModel } from "../models/index.js";
import { hashPassword, comparePassword } from "../helpers/bcrypt.helper.js";
import { signToken } from "../helpers/jwt.helper.js";

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const userExist = await UserModel.findOne({
      where: {
        username,
      },
    });

    if (!userExist) {
      return res.status(401).json({
        message: "Credenciales incorrectas",
      });
    }

    const validPassword = await comparePassword(
      password,
      userExist.password
    );

    if (!validPassword) {
      return res.status(401).json({
        message: "Credenciales incorrectas",
      });
    }

    const token = signToken({ idUser: userExist.id });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    });

    return res.status(201).json({
      message: "Usuario logueado correctamente",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

export const register = async (req, res) => {
  try {
    const { name, lastname, username, email, password } = req.body;

    const hashedPassword = await hashPassword(password);

    const newUser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
    });

    await ProfileModel.create({
      name,
      lastname,
      user_id: newUser.id,
    });

    return res.status(201).json({
      message: "Usuario creado correctamente",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");

  return res.json({
    message: "Logout exitoso",
  });
};