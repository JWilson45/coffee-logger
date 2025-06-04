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
  const [openIds, setOpenIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetch("/api/brews")
      .then(res => res.json())
      .then(setBrews);
  }, []);

  const detailColumns: { key: keyof Brew; label: string }[] = [
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

  function toggle(id: number) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Brew Log</h1>
        <Link href="/brews/new">
          <button className="btn-primary">Add Brew</button>
        </Link>
      </div>
      {brews.length === 0 ? (
        <div className="text-gray-500">No brews yet. Click &quot;Add Brew&quot; to get started!</div>
      ) : (
        <div className="space-y-4">
          {brews.map((brew) => (
            <div key={brew.id} className="border rounded-lg">
              <button
                type="button"
                onClick={() => toggle(brew.id)}
                className="w-full flex justify-between items-center p-4 text-left"
              >
                <div>
                  <div className="font-semibold">
                    {brew.date} - {brew.coffee}
                  </div>
                  <div className="text-sm text-gray-600">{brew.roaster}</div>
                </div>
                <div className="text-sm text-gray-700">
                  {brew.dose}g &bull; {brew.brewTime} &bull; {brew.score}
                </div>
              </button>
              {openIds.has(brew.id) && (
                <div className="p-4 border-t text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {detailColumns.map((col) => (
                      <div key={col.key as string} className="flex">
                        <div className="font-semibold w-32 mr-2">{col.label}:</div>
                        <div>{(brew[col.key] ?? "").toString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
