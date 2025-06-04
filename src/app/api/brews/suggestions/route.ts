// File: src/app/api/brews/suggestions/route.ts
import { Prisma, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const fields = [
    "coffee", "roaster", "origin", "process",
    "grind", "grinder", "dripper", "filter",
    "waterType", "waterTemp", "dose", "waterWeight", "brewTime",
    "bloom", "pours", "agitation", "flavorHot", "acidity", "sweetness",
    "body", "bitterness", "flavorCool", "balance"
  ];
  const suggestions: Record<string, string[]> = {};

  for (const field of fields) {
    const values = await prisma.brew.findMany({
      select: { [field]: true },
      distinct: [field as Prisma.BrewScalarFieldEnum],
      take: 20,
      orderBy: { date: "desc" },
    }) as Array<Record<string, unknown>>;
    suggestions[field] = values
      .map((v) => v[field]?.toString())
      .filter((v): v is string => Boolean(v));
  }

  return NextResponse.json(suggestions);
}