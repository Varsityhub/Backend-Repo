import DataTypesConfig from "../db/config";
import { DataTypes } from "sequelize";
import { AdminTokensInstance } from "../types/AdminToken";

const AdminTokens = DataTypesConfig.define<AdminTokensInstance>(
  "admin_tokens",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue:DataTypes.UUIDV4,
      primaryKey: true,
    },
    adminId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
);


export default AdminTokens