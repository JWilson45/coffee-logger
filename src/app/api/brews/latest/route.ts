import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const brew = await prisma.brew.findFirst({
    orderBy: { createdAt: "desc" },
  });
  if (!brew) {
    return NextResponse.json({}, { status: 404 });
  }
  return NextResponse.json(brew);
}
