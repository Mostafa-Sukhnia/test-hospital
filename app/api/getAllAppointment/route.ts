import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { Appointment } from "@prisma/client";

const prisma = new PrismaClient();

import { verifyJwt } from "@/app/utils/security/jwt";
import {DecodedToken} from "@/app/utils/security/TypeJWT"
export const GET = async (req:NextRequest) => {
  try {
    const jwt = req.headers.get("Authorization");
    if (!jwt) {
      return NextResponse.json(
        { message: "The token is missing" },
        { status: 401 }
      );
    }
    const decode = verifyJwt(jwt) as DecodedToken;
    if (!decode || !decode.userId) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
    const user:Appointment[] = await prisma.appointment.findMany({
      where: {
        patientId: decode.userId,
      },
    });

    return NextResponse.json({ message: "fetch is done",data:user }, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { message: `Internal Server Error:\n ${error}`, },
      { status: 500 }
    );
  }
};
