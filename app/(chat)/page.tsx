"use client";

import { useMemo, useState } from "react";

const numberRows = [
  ["7", "8", "9"],
  ["4", "5", "6"],
  ["1", "2", "3"],
];

function normalizeExpression(expression: string) {
  return expression.replace(/÷/g, "/").replace(/×/g, "*").replace(/−/g, "-");
}

function evaluateExpression(expression: string) {
  const safeExpression = normalizeExpression(expression).replace(/[^0-9.+\-*/() ]/g, "");
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
  const [activeView, setActiveView] = useState<"calculator" | "plataformer">("calculator");

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

    if (value === "%") {
      const numericValue = Number(display);
      if (Number.isFinite(numericValue)) {
        setDisplay(String(numericValue / 100));
      } else {
        setDisplay("Error");
      }
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
      <div className="flex w-full max-w-5xl flex-col gap-4 rounded-[2rem] border border-white/10 bg-slate-900/80 p-4 shadow-2xl shadow-slate-900/40 md:flex-row md:p-6">
        <aside className="flex w-full flex-col gap-3 rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-3 md:w-56">
          <div className="px-2 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Menú
          </div>
          <button
            type="button"
            onClick={() => setActiveView("calculator")}
            className={
              "rounded-2xl border px-4 py-3 text-left text-sm font-medium transition " +
              (activeView === "calculator"
                ? "border-indigo-500 bg-indigo-500/15 text-indigo-200"
                : "border-white/10 bg-slate-900/70 text-slate-200 hover:bg-slate-800")
            }
          >
            Calculadora
          </button>
          <button
            type="button"
            onClick={() => setActiveView("plataformer")}
            className={
              "rounded-2xl border px-4 py-3 text-left text-sm font-medium transition " +
              (activeView === "plataformer"
                ? "border-indigo-500 bg-indigo-500/15 text-indigo-200"
                : "border-white/10 bg-slate-900/70 text-slate-200 hover:bg-slate-800")
            }
          >
            Plataformer
          </button>
        </aside>

        <section className="flex-1">
          {activeView === "calculator" ? (
            <div className="mx-auto w-full max-w-[22rem] rounded-[2rem] border border-white/10 bg-slate-900/90 p-4 shadow-2xl shadow-slate-900/40 sm:p-5">
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
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      className="flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-slate-700 font-semibold text-slate-100 transition hover:bg-slate-600"
                      onClick={() => handleButton("C")}
                    >
                      C
                    </button>
                    <button
                      type="button"
                      className="flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-slate-700 font-semibold text-slate-100 transition hover:bg-slate-600"
                      onClick={() => handleButton("DEL")}
                    >
                      DEL
                    </button>
                    <button
                      type="button"
                      className="flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-slate-700 font-semibold text-slate-100 transition hover:bg-slate-600"
                      onClick={() => handleButton("÷")}
                    >
                      ÷
                    </button>
                  </div>

                  {numberRows.map((row, rowIndex) => (
                    <div key={rowIndex} className="grid grid-cols-3 gap-3">
                      {row.map((label) => (
                        <button
                          key={label}
                          type="button"
                          className="flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-slate-900 text-slate-100 font-semibold transition hover:bg-slate-800"
                          onClick={() => handleButton(label)}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  ))}

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className="flex h-14 items-center justify-start rounded-2xl border border-white/10 bg-slate-900 pl-6 font-semibold text-slate-100 transition hover:bg-slate-800"
                      onClick={() => handleButton("0")}
                    >
                      0
                    </button>
                    <button
                      type="button"
                      className="flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-slate-900 font-semibold text-slate-100 transition hover:bg-slate-800"
                      onClick={() => handleButton(".")}
                    >
                      .
                    </button>
                  </div>
                </div>

                <div className="grid gap-3">
                  <button
                    type="button"
                    className="flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-slate-800 font-semibold text-slate-200 transition hover:bg-slate-700"
                    onClick={() => handleButton("%")}
                  >
                    %
                  </button>
                  <button
                    type="button"
                    className="flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-slate-800 font-semibold text-slate-200 transition hover:bg-slate-700"
                    onClick={() => handleButton("×")}
                  >
                    ×
                  </button>
                  <button
                    type="button"
                    className="flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-slate-800 font-semibold text-slate-200 transition hover:bg-slate-700"
                    onClick={() => handleButton("−")}
                  >
                    −
                  </button>
                  <button
                    type="button"
                    className="flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-slate-800 font-semibold text-slate-200 transition hover:bg-slate-700"
                    onClick={() => handleButton("+")}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-indigo-500 font-semibold text-white transition hover:bg-indigo-600"
                    onClick={() => handleButton("=")}
                  >
                    =
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[32rem] items-center justify-center rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 text-center shadow-2xl shadow-slate-900/40">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Vista local</p>
                <h1 className="mt-3 text-3xl font-semibold text-slate-100">plataformer</h1>
                <p className="mt-2 text-sm text-slate-400">
                  Aquí puedes mostrar el contenido que quieras sin salir de la misma página.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
