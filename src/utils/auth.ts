import jwt from "jsonwebtoken";

const TOKEN_SECRET = process.env.TOKEN_SECRET || "yoursecret";

export const verifyToken = (token: string) => {
  return jwt.verify(token, TOKEN_SECRET);
};
