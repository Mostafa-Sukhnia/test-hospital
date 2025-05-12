import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from 'next/server';
import { validateEmail, validatePassword } from "@/app/utils/modelUser";
import { verifyJwt } from "@/app/utils/security/jwt";
import {hashPassword} from "@/app/utils/bcryptUtil"
import {JwTPatch} from "@/app/api/profile/Type"
const prisma = new PrismaClient();
export const PATCH = async (req: NextRequest) => {
  try {
    const data = await req.json();
    const jwt = req.headers.get("Authorization");

    if (!jwt) {
      return NextResponse.json({ message: "Missing token" }, { status: 401 });
    }

    const decoded = verifyJwt(jwt);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const { id, email, password, ...otherFields } = data;
    const idNumber = Number(id);

    if (isNaN(idNumber)) {
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
    }

    if (email && !validateEmail(email)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
    }

  if (password) {
  if (!validatePassword(password)) {
    return NextResponse.json({ message: "Invalid password format" }, { status: 400 });
  }
}

    const updateData: JwTPatch = { ...otherFields };
    if (email) updateData.email = email;
    if (password) updateData.password = await hashPassword(password);

    const userUpdated = await prisma.user.update({
        where: { id: idNumber },
        data: updateData,
    });

    return NextResponse.json({ message: "User updated successfully", userUpdated }, { status: 200 });

    } catch (error) {
        console.error("Update error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
};
