"use client";

import { useMemo, useState } from "react";

const buttons = [
  ["C", "DEL", "/"],
  ["7", "8", "9", "*"],
  ["4", "5", "6", "-"],
  ["1", "2", "3", "+"],
  ["0", ".", "="]
];

function evaluateExpression(expression: string) {
  const safeExpression = expression.replace(/[^0-9.+\-*/() ]/g, "");
  try {
    // eslint-disable-next-line no-new-func
    const result = new Function(`return ${safeExpression}`)();
    return typeof result === "number" && Number.isFinite(result)
      ? String(result)
      : "Error";
  } catch {
    return "Error";
  }
}

export default function Page() {
  const [display, setDisplay] = useState("0");
  const [error, setError] = useState<string | null>(null);

  const formattedDisplay = useMemo(() => display || "0", [display]);

  const handleButton = (value: string) => {
    setError(null);

    if (value === "C") {
      setDisplay("0");
      return;
    }

    if (value === "DEL") {
      setDisplay((current) => {
        const next = current.slice(0, -1);
        return next.length === 0 ? "0" : next;
      });
      return;
    }

    if (value === "=") {
      const next = evaluateExpression(display);
      if (next === "Error") {
        setError("Expresión inválida");
      }
      setDisplay(next);
      return;
    }

    setDisplay((current) => {
      if (current === "0" || current === "Error") {
        return value;
      }
      return current + value;
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/90 p-6 shadow-2xl shadow-slate-900/40">
        <div className="mb-6 rounded-3xl bg-slate-800/80 p-5 text-right text-4xl font-semibold tracking-tight text-slate-100">
          {formattedDisplay}
        </div>
        {error ? (
          <div className="mb-4 rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
            {error}
          </div>
        ) : null}
        <div className="grid gap-3 text-lg sm:grid-cols-4">
          {buttons.flat().map((label) => (
            <button
              key={label}
              type="button"
              className={
                "rounded-2xl border border-white/10 px-4 py-5 font-semibold transition hover:bg-slate-700/90 " +
                (label === "="
                  ? "col-span-2 bg-indigo-500 text-white hover:bg-indigo-600"
                  : label === "C" || label === "DEL"
                  ? "bg-slate-700 text-slate-100 hover:bg-slate-600"
                  : "/-*+".includes(label)
                  ? "bg-slate-800 text-slate-200 hover:bg-slate-700"
                  : "bg-slate-900 text-slate-100 hover:bg-slate-800")
              }
              onClick={() => handleButton(label)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
