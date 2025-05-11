import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const existingUser = async (email:string) => {
    const user  = await prisma.user.findUnique({
        where:{
            email:email
        }
    }
    )
    if(user){
        return true
    }else{
        return false
    }
}