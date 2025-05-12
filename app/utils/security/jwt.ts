import jwt from "jsonwebtoken";
const secretKey = process.env.JWT_SECRET_KEY;
import dotenv from "dotenv";
import { JwT } from "@/app/api/profile/Type";

dotenv.config();
export const generateToken = (userId: number, email: string, role: string) => {
  const payload = {
    userId,
    email,
    role,
  };
  const options = {
    expiresIn: "1h",
  };
  if (!secretKey) {
    throw new Error("JWT_SECRET_KEY is not defined");
  }
  return jwt.sign(payload, secretKey, options);
};

export const verifyJwt = (authHeader: string) => {
 
  const token = authHeader.split(" ")[1];
  if (!secretKey) {
    throw new Error("JWT_SECRET_KEY is not defined");
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded as JwT;
  } catch (error) {
    return error;
  }
};
