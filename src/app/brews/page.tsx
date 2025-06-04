"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

type Brew = {
  id: number;
  date: string;
  coffee: string;
  roaster: string;
  origin: string;
  process: string;
  notes: string;
  grind: string;
  grinder: string;
  dripper: string;
  filter: string;
  waterType: string;
  waterTemp: string;
  dose: string;
  waterWeight: string;
  brewTime: string;
  bloom: string;
  pours: string;
  agitation: string;
  flavorHot: string;
  acidity: string;
  sweetness: string;
  body: string;
  bitterness: string;
  flavorCool: string;
  newNotes: string;
  balance: string;
  score: string;
  extraNotes: string;
  createdAt: string;
};

export default function BrewsPage() {
  const [brews, setBrews] = useState<Brew[]>([]);

  useEffect(() => {
    fetch("/api/brews")
      .then(res => res.json())
      .then(setBrews);
  }, []);

  // List all fields to display as columns
  const columns: { key: keyof Brew; label: string }[] = [
    { key: "date", label: "Date" },
    { key: "coffee", label: "Coffee" },
    { key: "roaster", label: "Roaster" },
    { key: "origin", label: "Origin" },
    { key: "process", label: "Process" },
    { key: "notes", label: "Notes" },
    { key: "grind", label: "Grind" },
    { key: "grinder", label: "Grinder" },
    { key: "dripper", label: "Dripper" },
    { key: "filter", label: "Filter" },
    { key: "waterType", label: "Water Type" },
    { key: "waterTemp", label: "Water Temp (°C)" },
    { key: "dose", label: "Coffee Dose (g)" },
    { key: "waterWeight", label: "Water Weight (g)" },
    { key: "brewTime", label: "Brew Time" },
    { key: "bloom", label: "Bloom" },
    { key: "pours", label: "Pours" },
    { key: "agitation", label: "Agitation" },
    { key: "flavorHot", label: "Flavor (Hot)" },
    { key: "acidity", label: "Acidity" },
    { key: "sweetness", label: "Sweetness" },
    { key: "body", label: "Body" },
    { key: "bitterness", label: "Bitterness" },
    { key: "flavorCool", label: "Flavor (Cool)" },
    { key: "newNotes", label: "New Notes" },
    { key: "balance", label: "Balance" },
    { key: "score", label: "Score" },
    { key: "extraNotes", label: "Extra Notes" },
    { key: "createdAt", label: "Created" },
  ];

  return (
    <main className="p-8 max-w-full mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Brew Log</h1>
        <Link href="/brews/new">
          <button className="btn-primary">Add Brew</button>
        </Link>
      </div>
      {brews.length === 0 ? (
        <div className="text-gray-500">No brews yet. Click "Add Brew" to get started!</div>
      ) : (
        <div className="overflow-auto border rounded-xl">
          <table className="min-w-[1500px] border-collapse text-xs">
            <thead>
              <tr>
                {columns.map(col => (
                  <th key={col.key as string} className="p-2 border-b font-bold text-left whitespace-nowrap bg-gray-50 sticky top-0 z-10">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {brews.map((brew) => (
                <tr key={brew.id} className="even:bg-gray-50">
                  {columns.map(col => (
                    <td key={col.key as string} className="p-2 border-b whitespace-nowrap max-w-[220px] overflow-x-auto">
                      {(brew[col.key] ?? "").toString()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}