import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
import { validatePassword, validateEmail } from "@/app/utils/modelUser";
import { hashPasswordCompare } from "@/app/utils/bcryptUtil";
import { existingUser } from "@/app/controllers/authController";
import {generateToken} from "@/app/utils/security/jwt";

export const POST = async (req:Request) => {
    try {
        const {email, password} = await req.json();
        if (!validateEmail(email)){
            return NextResponse.json({message:"Invalid email"}, {status:400})
        }else if (!validatePassword(password)){
            return NextResponse.json({message:"Invalid password"}, {status:400})
        }else if (!await existingUser(email)){
            return NextResponse.json({message:"User not exists"}, {status:400})
        }else{
            const user = await prisma.user.findUnique({
                where:{
                    email:email
                }
            })
            if(user){
                const isPasswordValid = await hashPasswordCompare(password, user.password);
                if(isPasswordValid){
                    NextResponse.json({message:"User logged in successfully"}, {status:200})
                    const token = generateToken(user.id,user.email,user.role); 
                    return NextResponse.json({token:token, user:user}, {status:200})
                }else{
                    return NextResponse.json({message:"Invalid password"}, {status:400})
                }
            }else{
                return NextResponse.json({message:"User not found"}, {status:400})
            }
        }
    }catch(error){
        throw new Error(`Internal Server Error:\n ${error}`)
    }
}