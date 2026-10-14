import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const TechnologyModel = sequelize.define("Technology", {
  // TODO: 1. name: string, único y obligatorio.
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  // TODO: 2. description: texto, opcional.
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

export default TechnologyModel;