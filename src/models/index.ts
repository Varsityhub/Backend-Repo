import Department from "./Department.model";
import User from "./User.model";
import UserTokens from "./Usertokens.model";

export const setupAssociations = async () => {
  try {
    // User to Tokens [One-to-many]
    User.hasMany(UserTokens, { foreignKey: "userId", as: "tokens" });
    UserTokens.belongsTo(User, { foreignKey: "userId", as: "user" });

    //Department to User [One-to-One]
    User.hasOne(Department, { foreignKey: "userId", as: "department" });
    Department.belongsTo(User, { foreignKey: "userId", as: "user" });
  } catch (error: any) {
    throw new Error(error);
  }
};
