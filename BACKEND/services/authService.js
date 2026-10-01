import { User } from "../models/index.js";
import { comparePassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";
import bcrypt from "bcryptjs";

const publicUser = (user) => {
  const data = user.toJSON();
  delete data.password;
  return data;
};
export const register = async ({ name, email, password, role }) => {
  const normalizedEmail = email.toLowerCase();

  const existingUser = await User.findOne({
    where: {
      email: normalizedEmail,
    },
  });

  if (existingUser) {
    const error = new Error("Cet email est déjà utilisé");
    error.statusCode = 409;
    throw error;
  }

  // Hasher le mot de passe
  const hashedPassword = await bcrypt.hash(password, 12);

  // Créer l'utilisateur
  const user = await User.create({
    name,
    email: normalizedEmail,
    password: hashedPassword,
    role,
    isActive: true,
  });

  const token = signToken({
    id: user.id,
    role: user.role,
  });

  return {
    token,
    user: publicUser(user),
  };
};
// export const register = async ({ name, email, password, role }) => {
//   const existingUser = await User.findOne({
//     where: { email },
//   });

//   if (existingUser) {
//     const error = new Error("Cet email est déjà utilisé");
//     error.statusCode = 409;
//     throw error;
//   }

//   const hashedPassword = await bcrypt.hash(password, 12);

//   const user = await User.create({
//     name,
//     email,
//     password: hashedPassword,
//     role,
//     isActive: true,
//   });

//   return {
//     user: {
//       id: user.id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       isActive: user.isActive,
//     },
//   };
// };

export const login = async ({ email, password }) => {
  const user = await User.findOne({ where: { email: email.toLowerCase() } });
  if (
    !user ||
    !user.isActive ||
    !(await comparePassword(password, user.password))
  ) {
    const error = new Error("Email ou mot de passe incorrect");
    error.statusCode = 401;
    throw error;
  }
  user.lastLoginAt = new Date();
  await user.save();
  return {
    token: signToken({ id: user.id, role: user.role }),
    user: publicUser(user),
  };
};

export const me = (user) => publicUser(user);
