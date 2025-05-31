// UX-Improved, scroll-snap, grouped sections for new brew form
"use client";
import { useState, useRef, useEffect } from "react";
type BrewInputProps = {
  label: string;
  name: keyof typeof defaultBrew;
  type?: string;
  placeholder?: string;
  suggestions?: string[];
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

function BrewInput({
  label,
  name,
  type = "text",
  placeholder,
  suggestions,
  required = true,
  value,
  onChange,
}: BrewInputProps) {
  return (
    <div>
      <label className="block mb-1 font-semibold">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        list={suggestions ? `${name}-options` : undefined}
        className="border rounded px-2 py-1 w-full"
        placeholder={placeholder}
        required={required}
      />
      {suggestions && (
        <datalist id={`${name}-options`}>
          {suggestions.map((opt, i) => (
            <option key={i} value={opt} />
          ))}
        </datalist>
      )}
    </div>
  );
}
import { useRouter } from "next/navigation";
import Link from "next/link";

const defaultBrew = {
  date: new Date().toISOString().split("T")[0],
  coffee: "",
  roaster: "",
  origin: "",
  process: "",
  notes: "",
  grind: "",
  grinder: "",
  dripper: "",
  filter: "",
  waterType: "",
  waterTemp: "",
  dose: "",
  waterWeight: "",
  brewTime: "",
  bloom: "",
  pours: "",
  agitation: "",
  flavorHot: "",
  acidity: "",
  sweetness: "",
  body: "",
  bitterness: "",
  flavorCool: "",
  newNotes: "",
  balance: "",
  score: "",
  extraNotes: "",
};

const REQUIRED_FIELDS = [
  "date", "coffee", "roaster", "origin", "process",
  "grind", "grinder", "dripper", "filter",
  "waterType", "waterTemp", "dose", "waterWeight", "brewTime", "bloom", "pours", "agitation",
  "flavorHot", "acidity", "sweetness", "body", "bitterness", "flavorCool",
  "balance", "score"
];

export default function NewBrewPage() {
  const [brew, setBrew] = useState(defaultBrew);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [suggestions, setSuggestions] = useState<Record<string, string[]>>({});
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    async function fetchSuggestions() {
      const res = await fetch("/api/brews/suggestions");
      if (res.ok) {
        setSuggestions(await res.json());
      }
    }
    fetchSuggestions();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setBrew({ ...brew, [e.target.name]: e.target.value });
  }

  function validate(brewData: typeof defaultBrew) {
    for (const field of REQUIRED_FIELDS) {
      const value = brewData[field as keyof typeof brewData];
      if (
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "") ||
        (field === "date" && (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)))
      ) {
        return `Please fill in the "${field}" field.`;
      }
    }
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const validation = validate(brew);
    if (validation) {
      setError(validation);
      // Scroll to top of formErrorRef if needed
      formRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/brews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brew),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || "An error occurred while saving.");
        setSaving(false);
        return;
      }
      router.push("/brews");
    } catch (err: any) {
      setError("Network error: " + err?.message);
      setSaving(false);
    }
  }

  // Clear error when user navigates to a new section
  useEffect(() => {
    const handleScroll = () => setError(null);
    const formEl = formRef.current;
    if (formEl) {
      formEl.addEventListener("scroll", handleScroll);
      return () => formEl.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <main className="h-screen overflow-hidden">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="h-screen overflow-y-scroll snap-y snap-mandatory"
      >
        {/* Section: Brew Details */}
        <section className="snap-start h-screen flex flex-col justify-center p-8 space-y-4">
          {error && (
            <div className="text-red-600 font-bold">
              {error}
            </div>
          )}
          <h2 className="text-2xl font-semibold mb-4">Brew Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BrewInput
              label="Date of Brew"
              name="date"
              type="date"
              value={brew.date}
              onChange={handleChange}
            />
            <BrewInput
              label="Coffee Name"
              name="coffee"
              value={brew.coffee}
              onChange={handleChange}
              placeholder="E.g., Ethiopia Guji"
              suggestions={suggestions.coffee}
            />
            <BrewInput
              label="Roaster"
              name="roaster"
              value={brew.roaster}
              onChange={handleChange}
              placeholder="E.g., Black & White"
              suggestions={suggestions.roaster}
            />
            <BrewInput
              label="Origin"
              name="origin"
              value={brew.origin}
              onChange={handleChange}
              placeholder="E.g., Ethiopia"
              suggestions={suggestions.origin}
            />
            <div className="md:col-span-2">
              <BrewInput
                label="Process"
                name="process"
                value={brew.process}
                onChange={handleChange}
                placeholder="E.g., Natural"
                suggestions={suggestions.process}
              />
            </div>
          </div>
        </section>

        {/* Section: Equipment */}
        <section className="snap-start h-screen flex flex-col justify-center p-8 space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Equipment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BrewInput
              label="Grinder"
              name="grinder"
              value={brew.grinder}
              onChange={handleChange}
              placeholder="E.g., Timemore Chestnut C3 Max"
              suggestions={suggestions.grinder}
            />
            <BrewInput
              label="Grind Setting"
              name="grind"
              value={brew.grind}
              onChange={handleChange}
              placeholder="E.g., 16 clicks"
              suggestions={suggestions.grind}
            />
            <BrewInput
              label="Dripper"
              name="dripper"
              value={brew.dripper}
              onChange={handleChange}
              placeholder="E.g., Bee House"
              suggestions={suggestions.dripper}
            />
            <BrewInput
              label="Filter Type"
              name="filter"
              value={brew.filter}
              onChange={handleChange}
              placeholder="E.g., CAFEC Abaca"
              suggestions={suggestions.filter}
            />
          </div>
        </section>

        {/* Section: Water & Brewing */}
        <section className="snap-start h-screen flex flex-col justify-center p-8 space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Water & Brewing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BrewInput
              label="Water Type"
              name="waterType"
              value={brew.waterType}
              onChange={handleChange}
              placeholder="E.g., Beach House"
              suggestions={suggestions.waterType}
            />
            <BrewInput
              label="Water Temp (°C)"
              name="waterTemp"
              type="number"
              value={brew.waterTemp}
              onChange={handleChange}
              placeholder="E.g., 96"
              suggestions={suggestions.waterTemp}
            />
            <BrewInput
              label="Coffee Dose (g)"
              name="dose"
              type="number"
              value={brew.dose}
              onChange={handleChange}
              placeholder="E.g., 15"
              suggestions={suggestions.dose}
            />
            <BrewInput
              label="Water Weight (g)"
              name="waterWeight"
              type="number"
              value={brew.waterWeight}
              onChange={handleChange}
              placeholder="E.g., 250"
              suggestions={suggestions.waterWeight}
            />
            <BrewInput
              label="Brew Time"
              name="brewTime"
              value={brew.brewTime}
              onChange={handleChange}
              placeholder="E.g., 2:15"
              suggestions={suggestions.brewTime}
            />
            <BrewInput
              label="Bloom (g/s)"
              name="bloom"
              value={brew.bloom}
              onChange={handleChange}
              placeholder="E.g., 45g/45s"
              suggestions={suggestions.bloom}
            />
            <BrewInput
              label="Pours"
              name="pours"
              value={brew.pours}
              onChange={handleChange}
              placeholder="E.g., 2"
              suggestions={suggestions.pours}
            />
            <BrewInput
              label="Agitation"
              name="agitation"
              value={brew.agitation}
              onChange={handleChange}
              placeholder="E.g., Fast/hard pour"
              suggestions={suggestions.agitation}
            />
          </div>
        </section>

        {/* Section: Tasting Notes */}
        <section className="snap-start h-screen flex flex-col justify-center p-8 space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Tasting Notes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BrewInput
              label="Flavor (Hot)"
              name="flavorHot"
              value={brew.flavorHot}
              onChange={handleChange}
              placeholder="E.g., Milk chocolate"
              suggestions={suggestions.flavorHot}
            />
            <BrewInput
              label="Acidity"
              name="acidity"
              value={brew.acidity}
              onChange={handleChange}
              placeholder="E.g., Medium"
              suggestions={suggestions.acidity}
            />
            <BrewInput
              label="Sweetness"
              name="sweetness"
              value={brew.sweetness}
              onChange={handleChange}
              placeholder="E.g., High"
              suggestions={suggestions.sweetness}
            />
            <BrewInput
              label="Body"
              name="body"
              value={brew.body}
              onChange={handleChange}
              placeholder="E.g., Light"
              suggestions={suggestions.body}
            />
            <BrewInput
              label="Bitterness"
              name="bitterness"
              value={brew.bitterness}
              onChange={handleChange}
              placeholder="E.g., Low"
              suggestions={suggestions.bitterness}
            />
            <div className="md:col-span-2">
              <BrewInput
                label="Flavor (Cool)"
                name="flavorCool"
                value={brew.flavorCool}
                onChange={handleChange}
                placeholder="E.g., Slightly dry"
                suggestions={suggestions.flavorCool}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1 font-semibold">Additional Notes</label>
              <textarea
                name="newNotes"
                value={brew.newNotes}
                onChange={handleChange}
                rows={3}
                className="border rounded px-2 py-1 w-full"
                placeholder="Any extra tasting notes"
              />
            </div>
          </div>
        </section>

        {/* Section: Evaluation */}
        <section className="snap-start h-screen flex flex-col justify-center p-8 space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Evaluation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BrewInput
              label="Balance"
              name="balance"
              value={brew.balance}
              onChange={handleChange}
              placeholder="E.g., Good"
              suggestions={suggestions.balance}
            />
            <div>
              <label className="block mb-1 font-semibold">Score</label>
              <input
                type="number"
                name="score"
                value={brew.score}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full"
                min="1"
                max="10"
                placeholder="1-10"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1 font-semibold">General Notes</label>
              <textarea
                name="extraNotes"
                value={brew.extraNotes}
                onChange={handleChange}
                rows={3}
                className="border rounded px-2 py-1 w-full"
                placeholder="Any additional comments"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <button className="btn-primary" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Brew"}
            </button>
            <Link href="/brews" className="btn-primary bg-gray-200 text-gray-900 hover:bg-gray-300">Cancel</Link>
          </div>
        </section>
      </form>
    </main>
  );
}