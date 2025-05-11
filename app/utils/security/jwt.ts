import jwt from "jsonwebtoken";
const secretKey = process.env.JWT_SECRET_KEY;
import dotenv from 'dotenv';

dotenv.config();
export const generateToken = (userId:number, email:string, role:string) => {
    const payload = {
        userId,
        email,
        role
    } 
    const options = {
        expiresIn: '1h'
    }
    if (!secretKey) {
    throw new Error('JWT_SECRET_KEY is not defined');
}
    return jwt.sign(payload, secretKey, options);
}

export const verifyJwt = (token:string) => {
    if (!secretKey) {
        throw new Error('JWT_SECRET_KEY is not defined');
    }
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        return error;
    }
}