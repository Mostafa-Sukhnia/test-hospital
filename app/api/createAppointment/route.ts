import {PrismaClient} from "@prisma/client";
import { NextRequest,NextResponse } from "next/server";
import {Apointment} from "./Types"
import { verifyJwt } from "@/app/utils/security/jwt";
const prisma = new PrismaClient()

export const POST = async (req:NextRequest) => {
    try{
    const jwt = await req.headers.get("Authorization");
    if(!jwt){
        return NextResponse.json({message:"Token missing"},{status:401})
    }
    const decode = verifyJwt(jwt)
    if(!decode || !decode.userId){
        return NextResponse.json({message:"Invalid Token"},{status:401})
    }
    const newApointment:Apointment = await req.json();
        await prisma.appointment.create({
            data:{
                date:new Date(newApointment.date),
                patientId : decode.userId,
            }
        })
        return NextResponse.json({message:"Appointment created"},{status:201})
    }catch(error){
        return NextResponse.json({message:`Internal Server Error: ${error}`},{status:500})
    }
}

