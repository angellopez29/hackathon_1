"use client";

import { useMemo, useState } from "react";

const TAB_LABELS = ["Calculadora", "Plataforma", "Bloques"] as const;
type TabLabel = (typeof TAB_LABELS)[number];

const numberButtons = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "."];
const topRowButtons = ["C", "DEL", "%", "÷"];
const sideOperatorButtons = ["×", "−", "+", "="];

function evaluateExpression(expression: string) {
  const safeExpression = expression.replace(/[^0-9.+\-*/() ]/g, "");
  try {
    // eslint-disable-next-line no-new-func
    const result = new Function(`return ${safeExpression}`)();
    return typeof result === "number" && Number.isFinite(result) ? String(result) : "Error";
  } catch {
    return "Error";
  }
}

function PlatformerScreen() {
  return (
    <div className="space-y-4">
      <div className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-4 text-slate-200 shadow-2xl shadow-slate-900/40">
        <h2 className="mb-3 text-xl font-semibold text-white">Plataforma</h2>
        <p className="text-sm leading-6 text-slate-300">
          Aquí puedes empezar a crear un juego de plataformas estilo Mario o Sonic.
          Después de definir los bloques, puedes extender esta pantalla con física, enemigos y niveles.
        </p>
      </div>
      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-800 p-4 shadow-inner shadow-slate-950/20">
        <div className="relative mx-auto h-[18rem] w-full max-w-[30rem] bg-slate-950">
          <div className="absolute left-10 top-60 h-8 w-8 rounded-full bg-indigo-400 shadow-lg shadow-indigo-500/30" />
          <div className="absolute left-0 top-[320px] h-10 w-full rounded-xl bg-slate-700" />
          <div className="absolute left-[80px] top-[240px] h-5 w-[120px] rounded-xl bg-slate-700" />
          <div className="absolute left-[230px] top-[190px] h-5 w-[140px] rounded-xl bg-slate-700" />
          <div className="absolute left-[380px] top-[260px] h-5 w-[80px] rounded-xl bg-slate-700" />
        </div>
        <div className="mt-4 rounded-3xl bg-slate-900/80 p-4 text-sm text-slate-300">
          Controles: <span className="font-semibold text-white">← →</span> para moverse, <span className="font-semibold text-white">↑</span> para saltar.
          Esta es una plantilla inicial para que continúes con la lógica del juego.
        </div>
      </div>
    </div>
  );
}

function BlocksScreen() {
  return (
    <div className="space-y-4">
      <div className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-4 text-slate-200 shadow-2xl shadow-slate-900/40">
        <h2 className="mb-3 text-xl font-semibold text-white">Bloques</h2>
        <p className="text-sm leading-6 text-slate-300">
          Usa esta pestaña para diseñar tus bloques y clases de plataformas.
          Los bloques son los cimientos de tu juego de plataformas.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { label: "Plataforma", description: "Bloques sólidos para pisar." },
          { label: "Trampolín", description: "Salta más alto al usarlo." },
          { label: "Moneda", description: "Objetivo recolectable." },
          { label: "Enemigo", description: "Obstáculo que evita el paso." },
        ].map((item) => (
          <div key={item.label} className="rounded-3xl border border-white/10 bg-slate-800 p-4">
            <h3 className="text-lg font-semibold text-white">{item.label}</h3>
            <p className="mt-2 text-sm text-slate-300">{item.description}</p>
          </div>
        ))}
      </div>
      <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-4 text-slate-300">
        <div className="grid gap-2 rounded-3xl bg-slate-800 p-4 text-sm">
          <div className="rounded-2xl bg-slate-700 p-3">Bloque básico</div>
          <div className="rounded-2xl bg-slate-700 p-3">Plataforma flotante</div>
          <div className="rounded-2xl bg-slate-700 p-3">Zona de salto</div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const [activeTab, setActiveTab] = useState<TabLabel>("Calculadora");
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
      <div className="w-full max-w-[48rem] rounded-[2rem] border border-white/10 bg-slate-900/90 p-4 shadow-2xl shadow-slate-900/40 sm:p-5">
        <div className="mb-6 flex flex-wrap gap-3">
          {TAB_LABELS.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => setActiveTab(label)}
              className={
                "rounded-3xl border px-4 py-2 text-sm font-semibold transition " +
                (activeTab === label
                  ? "border-indigo-300 bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                  : "border-white/10 bg-slate-800 text-slate-200 hover:bg-slate-700")
              }
            >
              {label}
            </button>
          ))}
        </div>
        {activeTab === "Calculadora" ? (
          <>
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
          </>
        ) : activeTab === "Plataforma" ? (
          <PlatformerScreen />
        ) : (
          <BlocksScreen />
        )}
      </div>
    </main>
  );
}
