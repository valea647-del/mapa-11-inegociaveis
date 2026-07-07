"use client";

import { AREAS } from "@/lib/areas";

export default function Radar({
  notas,
  tamanho = 280,
}: {
  notas: Record<string, number>;
  tamanho?: number;
}) {
  const n = AREAS.length;
  const cx = tamanho / 2;
  const cy = tamanho / 2;
  const raio = tamanho / 2 - 44;

  const ponto = (i: number, valor: number) => {
    const ang = (Math.PI * 2 * i) / n - Math.PI / 2;
    const r = (valor / 10) * raio;
    return [cx + r * Math.cos(ang), cy + r * Math.sin(ang)];
  };

  const aneis = [2.5, 5, 7.5, 10].map((v) =>
    AREAS.map((_, i) => ponto(i, v).join(",")).join(" ")
  );

  const dados = AREAS.map((a, i) => ponto(i, notas[a.id] ?? 0).join(",")).join(" ");

  return (
    <svg
      viewBox={`0 0 ${tamanho} ${tamanho}`}
      className="w-full h-auto"
      role="img"
      aria-label="Radar das 11 áreas"
    >
      {aneis.map((pts, i) => (
        <polygon key={i} points={pts} fill="none" stroke="#E8DEDB" strokeWidth="1" />
      ))}
      {AREAS.map((_, i) => {
        const [x, y] = ponto(i, 10);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#E8DEDB" strokeWidth="1" />;
      })}
      <polygon points={dados} fill="#C8102E" fillOpacity="0.14" stroke="#C8102E" strokeWidth="2" />
      {AREAS.map((a, i) => {
        const [x, y] = ponto(i, notas[a.id] ?? 0);
        return <circle key={a.id} cx={x} cy={y} r="3" fill="#C8102E" />;
      })}
      {AREAS.map((a, i) => {
        const [x, y] = ponto(i, 12.6);
        const anchor = Math.abs(x - cx) < 8 ? "middle" : x > cx ? "start" : "end";
        return (
          <text
            key={a.id}
            x={x}
            y={y}
            textAnchor={anchor}
            dominantBaseline="middle"
            fontSize="9"
            fill="#6E6461"
            fontFamily="Archivo, sans-serif"
          >
            {a.nome}
          </text>
        );
      })}
    </svg>
  );
}
