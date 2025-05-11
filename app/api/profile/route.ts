import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import { JwT } from "@/app/api/profile/Type";
import { verifyJwt } from "@/app/utils/security/jwt";

export const GET = async (req: NextRequest) => {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = authHeader.split(" ")[1];
  const decode: JwT = verifyJwt(token);
  if (decode instanceof Error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: Number(decode.userId),
    },
    select: {
      id: true,
      email: true,
      role: true,
      name: true,
      birthDate: true,
      gender: true,
    },
  });
  return NextResponse.json(user);
};
