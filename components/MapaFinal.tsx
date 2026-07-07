"use client";

import { Estado } from "@/lib/types";
import { BLOCOS } from "@/lib/areas";
import { CONFIG } from "@/lib/config";
import Radar from "./Radar";

export default function MapaFinal({ estado }: { estado: Estado }) {
  const data = estado.concluido_em
    ? new Date(estado.concluido_em).toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div id="mapa-final" className="bg-white border border-linha">
      <div className="print-area p-6 sm:p-10">
        <header className="border-b-2 border-vermelho pb-6 mb-8">
          <p className="text-[11px] uppercase tracking-[0.2em] text-vermelho mb-2">
            Método DOMA · Pilar 1 · Poder da Decisão
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-tinta">
            Mapa dos 11 Inegociáveis™
          </h1>
          <p className="text-sm text-cinza mt-2">
            {estado.nome ? `${estado.nome} · ` : ""}
            {data}
          </p>
        </header>

        {estado.espelho && (
          <section className="mb-8">
            <p className="text-[11px] uppercase tracking-[0.14em] text-cinza mb-2">
              O espelho de partida
            </p>
            <p className="font-display italic text-lg text-tinta leading-relaxed">
              &ldquo;{estado.espelho}&rdquo;
            </p>
          </section>
        )}

        {estado.diagnostico && (
          <section className="mb-8 max-w-sm mx-auto">
            <Radar notas={estado.diagnostico} />
          </section>
        )}

        {BLOCOS.map((b) => {
          const doBloco = estado.areas.filter((a) => a.bloco === b.nome);
          if (doBloco.length === 0) return null;
          return (
            <section key={b.nome} className="mb-8 avoid-break">
              <p className="text-[11px] uppercase tracking-[0.14em] text-vermelho mb-3">
                {b.nome} · {b.rotulo}
              </p>
              {doBloco.map((a) => (
                <div key={a.area} className="border-l-2 border-vermelho pl-4 mb-4">
                  <p className="text-xs uppercase tracking-wide text-cinza">{a.area}</p>
                  <p className="font-display text-lg text-tinta leading-snug">
                    {a.inegociavel}
                  </p>
                </div>
              ))}
            </section>
          );
        })}

        {estado.tensoes.length > 0 && (
          <section className="mb-8 bg-rosado p-5 avoid-break">
            <p className="text-[11px] uppercase tracking-[0.14em] text-vermelho mb-2">
              Tensões nomeadas · para leitura com {CONFIG.mentora}
            </p>
            <ul className="space-y-2">
              {estado.tensoes.map((t, i) => (
                <li key={i} className="text-sm text-tinta leading-relaxed">
                  {t}
                </li>
              ))}
            </ul>
            <p className="text-xs text-cinza mt-3">
              Nomear os 11 você fez sozinho. Ler o que acontece quando dois deles colidem
              é o trabalho da conversa diagnóstica.
            </p>
          </section>
        )}

        {(estado.integracao.metas_90_dias || estado.integracao.accountability) && (
          <section className="mb-8 avoid-break">
            <p className="text-[11px] uppercase tracking-[0.14em] text-vermelho mb-3">
              Integração prática · próximos 90 dias
            </p>
            {estado.integracao.metas_90_dias && (
              <p className="text-sm text-tinta leading-relaxed mb-2">
                {estado.integracao.metas_90_dias}
              </p>
            )}
            {estado.integracao.accountability && (
              <p className="text-sm text-cinza leading-relaxed">
                Accountability: {estado.integracao.accountability}
              </p>
            )}
            <p className="text-sm text-tinta mt-3">
              Cheque de coerência para toda decisão futura: isso respeita o que é
              inegociável para mim?
            </p>
          </section>
        )}

        <section className="border-t border-linha pt-6 avoid-break">
          <p className="font-display italic text-lg text-tinta leading-relaxed">
            Há um momento em que insistir começa a custar mais do que recomeçar. A
            coerência tem um preço, mas a incoerência tem juros. Viver tentando voltar ao
            que era é desperdiçar o que está nascendo. A decisão não é o ponto final da
            mudança, é o ponto de partida da verdade. Mudar custa. Não mudar custa mais.
          </p>
          <p className="text-xs text-cinza mt-3">{CONFIG.mentora} · Método DOMA</p>
        </section>
      </div>

      <div className="no-print border-t border-linha p-6 flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => window.print()}
          className="flex-1 bg-tinta text-white py-3 text-sm tracking-wide hover:opacity-90 transition-opacity"
        >
          Baixar o Mapa em PDF
        </button>
        <a
          href={CONFIG.contatoWhatsApp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-vermelho text-white py-3 text-sm tracking-wide text-center hover:bg-vinho transition-colors"
        >
          Agendar a conversa diagnóstica
        </a>
      </div>
    </div>
  );
}
