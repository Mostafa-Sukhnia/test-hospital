import bcrypt from 'bcryptjs';

export async function hashPassword(password:string){
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword
}

export async function hashPasswordCompare(password:string, hashedPassword:string){
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    return isPasswordValid
}