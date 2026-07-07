"use client";

import { useState } from "react";
import { AREAS, BLOCOS } from "@/lib/areas";

export default function Diagnostico({
  onEnviar,
}: {
  onEnviar: (notas: Record<string, number>) => void;
}) {
  const [notas, setNotas] = useState<Record<string, number>>(
    Object.fromEntries(AREAS.map((a) => [a.id, 5]))
  );

  return (
    <div className="border border-linha bg-white p-5 sm:p-6 my-2">
      <p className="font-display text-lg text-tinta mb-1">Como está cada área hoje?</p>
      <p className="text-sm text-cinza mb-5">
        De 0 a 10, sem pensar demais. A primeira resposta costuma ser a mais honesta.
      </p>
      {BLOCOS.map((b) => (
        <div key={b.nome} className="mb-5">
          <p className="text-[11px] uppercase tracking-[0.14em] text-vermelho mb-3">
            {b.nome} · {b.rotulo}
          </p>
          {AREAS.filter((a) => a.bloco === b.nome).map((a) => (
            <div key={a.id} className="flex items-center gap-3 mb-3">
              <label htmlFor={a.id} className="w-40 shrink-0 text-sm text-tinta">
                {a.nome}
              </label>
              <input
                id={a.id}
                type="range"
                min={0}
                max={10}
                step={1}
                value={notas[a.id]}
                onChange={(e) =>
                  setNotas({ ...notas, [a.id]: parseInt(e.target.value, 10) })
                }
                className="flex-1 accent-vermelho"
              />
              <span className="w-6 text-right font-display text-vermelho tabular-nums">
                {notas[a.id]}
              </span>
            </div>
          ))}
        </div>
      ))}
      <button
        onClick={() => onEnviar(notas)}
        className="w-full bg-vermelho text-white py-3 text-sm tracking-wide hover:bg-vinho transition-colors"
      >
        Enviar minhas notas
      </button>
    </div>
  );
}
