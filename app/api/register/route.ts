import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { existingUser } from "@/app/controllers/authController";
import { validatePassword, validateEmail } from "@/app/utils/modelUser";
import { hashPassword } from "@/app/utils/bcryptUtil";
import {generateToken} from "@/app/utils/security/jwt";

const prisma = new PrismaClient();
export const POST = async (req: Request) => {
  try {
    const { name, email, password, birthDate, gender } = await req.json();

    if (!validateEmail(email)) {
      return NextResponse.json({ message: "Invalid email" }, { status: 400 });
    }

    if (!validatePassword(password)) {
      return NextResponse.json({ message: "Invalid password" }, { status: 400 });
    }

    if (await existingUser(email)) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    const patient = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        birthDate: new Date(birthDate),
        gender,
      },
    });
    const token = generateToken(patient.id,patient.email,patient.role); 
    
    return NextResponse.json({ patient,token, message: "User created successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
