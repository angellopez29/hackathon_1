"use client";

import { useMemo, useState } from "react";

const numberButtons = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "."];
const topRowButtons = ["C", "DEL", "%", "÷"];
const sideOperatorButtons = ["×", "−", "+", "="];
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
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-6 text-white sm:py-10">
      <div className="w-full max-w-[22rem] rounded-[2rem] border border-white/10 bg-slate-900/90 p-4 shadow-2xl shadow-slate-900/40 sm:p-5">
        <div className="mb-5 min-h-[5.5rem] rounded-[1.5rem] bg-slate-800/80 p-4 text-right text-4xl font-semibold tracking-tight text-slate-100">
          {formattedDisplay}
        </div>
        {error ? (
          <div className="mb-4 rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
            {error}
          </div>
        ) : null}
        <div className="grid grid-cols-[1fr_5.2rem] gap-3 text-lg">
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-4 gap-3">
              {topRowButtons.map((label) => (
                <button
                  key={label}
                  type="button"
                  className="flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-slate-700 font-semibold text-slate-100 transition hover:bg-slate-600"
                  onClick={() => handleButton(label)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3">
              {numberButtons.map((label) => (
                <button
                  key={label}
                  type="button"
                  className="flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-slate-900 text-slate-100 font-semibold transition hover:bg-slate-800"
                  onClick={() => handleButton(label)}
                >
                  {label}
                </button>
              ))}
              <button
                key="0"
                type="button"
                className="col-span-2 flex h-14 items-center justify-start rounded-2xl border border-white/10 bg-slate-900 pl-6 font-semibold text-slate-100 transition hover:bg-slate-800"
                onClick={() => handleButton("0")}
              >
                0
              </button>
              <button
                key="."
                type="button"
                className="flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-slate-900 font-semibold text-slate-100 transition hover:bg-slate-800"
                onClick={() => handleButton(".")}
              >
                .
              </button>
            </div>
          </div>

          <div className="grid gap-3">
            {sideOperatorButtons.map((label) => (
              <button
                key={label}
                type="button"
                className={
                  "flex h-14 items-center justify-center rounded-2xl border border-white/10 font-semibold transition " +
                  (label === "="
                    ? "bg-indigo-500 text-white hover:bg-indigo-600"
                    : "bg-slate-800 text-slate-200 hover:bg-slate-700")
                }
                onClick={() => handleButton(label)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
