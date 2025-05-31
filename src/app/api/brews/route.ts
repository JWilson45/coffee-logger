import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const REQUIRED_FIELDS = [
  "date", "coffee", "roaster", "origin", "process", "grind", "grinder", "dripper", "filter", "waterType",
  "waterTemp", "dose", "waterWeight", "brewTime", "bloom", "pours", "agitation", "flavorHot",
  "acidity", "sweetness", "body", "bitterness", "flavorCool", "balance", "score"
];

export async function GET() {
  const brews = await prisma.brew.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(brews);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  for (const field of REQUIRED_FIELDS) {
    if (!(field in data) || data[field] === "") {
      return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
    }
  }
  try {
    const brew = await prisma.brew.create({ data });
    return NextResponse.json(brew);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}