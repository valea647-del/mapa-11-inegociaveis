"use client";

import { useEffect, useRef, useState } from "react";
import { AREAS } from "@/lib/areas";
import { CONFIG } from "@/lib/config";
import { Estado, Mensagem, estadoInicial } from "@/lib/types";
import { processarResposta } from "@/lib/parser";
import Diagnostico from "@/components/Diagnostico";
import Radar from "@/components/Radar";
import MapaFinal from "@/components/MapaFinal";

const CHAVE = "mapa11.v1";
const FASES = [
  "Acolhimento",
  "Diagnóstico",
  "As 11 áreas",
  "Clareza para escolher",
  "Mapa e Manifesto",
];

interface Sessao {
  estado: Estado;
  mensagens: Mensagem[];
}

export default function Pagina() {
  const [iniciado, setIniciado] = useState(false);
  const [temSessao, setTemSessao] = useState(false);
  const [estado, setEstado] = useState<Estado>(estadoInicial());
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [texto, setTexto] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const fimRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const salvo = localStorage.getItem(CHAVE);
      if (salvo) setTemSessao(true);
    } catch {}
  }, []);

  useEffect(() => {
    if (!iniciado) return;
    try {
      const sessao: Sessao = { estado, mensagens };
      localStorage.setItem(CHAVE, JSON.stringify(sessao));
    } catch {}
  }, [estado, mensagens, iniciado]);

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens, carregando]);

  async function chamar(novas: Mensagem[], estadoAtual: Estado) {
    setCarregando(true);
    setErro("");
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mensagens: novas, estado: estadoAtual }),
      });
      const dados = await r.json();
      if (!r.ok) throw new Error(dados.erro || "Falha na conversa.");
      const { limpo, estado: atualizado } = processarResposta(dados.texto, estadoAtual);
      setEstado(atualizado);
      setMensagens([...novas, { role: "assistant", content: limpo }]);
    } catch (e) {
      setErro(
        "A conversa falhou agora. Sua jornada está salva neste navegador. Tente enviar de novo."
      );
      setMensagens(novas);
    } finally {
      setCarregando(false);
    }
  }

  function comecar(retomar: boolean) {
    if (retomar) {
      try {
        const salvo = localStorage.getItem(CHAVE);
        if (salvo) {
          const sessao: Sessao = JSON.parse(salvo);
          setEstado(sessao.estado);
          setMensagens(sessao.mensagens);
          setIniciado(true);
          return;
        }
      } catch {}
    }
    localStorage.removeItem(CHAVE);
    const inicial = estadoInicial();
    setEstado(inicial);
    setIniciado(true);
    chamar([{ role: "user", content: "Cheguei. Pode começar." }], inicial);
  }

  function enviar() {
    const t = texto.trim();
    if (!t || carregando) return;
    setTexto("");
    const novas: Mensagem[] = [...mensagens, { role: "user", content: t }];
    let estadoAtual = estado;
    if (estado.fase === 1 && !estado.espelho) {
      estadoAtual = { ...estado, espelho: t };
      setEstado(estadoAtual);
    }
    chamar(novas, estadoAtual);
  }

  function enviarDiagnostico(notas: Record<string, number>) {
    const estadoAtual: Estado = { ...estado, diagnostico: notas };
    setEstado(estadoAtual);
    const resumo = AREAS.map((a) => `${a.nome}: ${notas[a.id]}`).join(", ");
    const novas: Mensagem[] = [
      ...mensagens,
      { role: "user", content: `[DIAGNÓSTICO] ${resumo}` },
    ];
    chamar(novas, estadoAtual);
  }

  if (!iniciado) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-white border border-linha p-8 sm:p-12">
          <p className="text-[11px] uppercase tracking-[0.2em] text-vermelho mb-3">
            Método DOMA · Pilar 1 · Poder da Decisão
          </p>
          <h1 className="font-display text-4xl sm:text-5xl text-tinta leading-tight mb-4">
            Mapa dos 11 Inegociáveis™
          </h1>
          <p className="text-cinza leading-relaxed mb-8">
            Uma conversa guiada para você nomear o que não está disposto a sacrificar,
            área por área, e sair com o seu Mapa. Não é sobre mudar tudo. É sobre
            reorganizar o que importa.
          </p>
          <button
            onClick={() => comecar(false)}
            className="w-full bg-vermelho text-white py-4 text-sm tracking-wide hover:bg-vinho transition-colors"
          >
            Começar minha jornada
          </button>
          {temSessao && (
            <button
              onClick={() => comecar(true)}
              className="w-full mt-3 border border-tinta text-tinta py-4 text-sm tracking-wide hover:bg-nevoa transition-colors"
            >
              Retomar de onde parei
            </button>
          )}
          <p className="text-xs text-cinza mt-6">
            {CONFIG.mentora} · a jornada fica salva neste navegador.
          </p>
        </div>
      </main>
    );
  }

  const mostrarSliders =
    estado.fase === 2 && !estado.diagnostico && !carregando && mensagens.length > 0;

  return (
    <main className="min-h-screen">
      <header className="app-header sticky top-0 z-10 bg-white border-b border-linha">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-display text-tinta">Mapa dos 11 Inegociáveis™</p>
            <p className="text-xs text-cinza hidden sm:block">
              Fase {estado.fase} de 5 · {FASES[estado.fase - 1]}
              {estado.fase === 3 && ` · ${estado.areas.length} de 11 nomeados`}
            </p>
          </div>
          <div className="flex gap-1 mt-2" aria-hidden>
            {FASES.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 ${i < estado.fase ? "bg-vermelho" : "bg-linha"}`}
              />
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-8">
        <div>
          <div className="space-y-4">
            {mensagens.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-8 sm:ml-16 bg-white border border-linha p-4 text-tinta text-[15px] leading-relaxed"
                    : "mr-8 sm:mr-16 border-l-2 border-vermelho pl-4 py-1 text-tinta text-[15px] leading-relaxed whitespace-pre-wrap"
                }
              >
                {m.content}
              </div>
            ))}
            {carregando && (
              <div className="mr-16 border-l-2 border-vermelho pl-4 py-1 text-cinza text-sm">
                Escrevendo...
              </div>
            )}
            {erro && (
              <div className="bg-rosado p-4 text-sm text-tinta">
                {erro}{" "}
                <button
                  onClick={() => chamar(mensagens, estado)}
                  className="underline text-vermelho"
                >
                  Enviar de novo
                </button>
              </div>
            )}
            {mostrarSliders && <Diagnostico onEnviar={enviarDiagnostico} />}
            {estado.concluido && (
              <div className="pt-4">
                <MapaFinal estado={estado} />
              </div>
            )}
            <div ref={fimRef} />
          </div>

          {!estado.concluido && (
            <div className="no-print sticky bottom-0 bg-nevoa pt-3 pb-4 mt-4">
              <div className="flex gap-2">
                <textarea
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      enviar();
                    }
                  }}
                  rows={2}
                  placeholder="Escreva aqui..."
                  className="flex-1 border border-linha bg-white p-3 text-[15px] resize-none focus:outline-none focus:border-vermelho"
                  disabled={carregando || mostrarSliders}
                />
                <button
                  onClick={enviar}
                  disabled={carregando || !texto.trim()}
                  className="bg-vermelho text-white px-6 text-sm tracking-wide disabled:opacity-40 hover:bg-vinho transition-colors"
                >
                  Enviar
                </button>
              </div>
            </div>
          )}
        </div>

        <aside className="no-print hidden lg:block">
          <div className="sticky top-20 space-y-6">
            {estado.diagnostico && (
              <div className="bg-white border border-linha p-4">
                <p className="text-[11px] uppercase tracking-[0.14em] text-cinza mb-2">
                  Seu radar
                </p>
                <Radar notas={estado.diagnostico} tamanho={230} />
              </div>
            )}
            <div className="bg-white border border-linha p-4">
              <p className="text-[11px] uppercase tracking-[0.14em] text-cinza mb-3">
                As 11 áreas
              </p>
              <ul className="space-y-1.5">
                {AREAS.map((a) => {
                  const feito = estado.areas.find(
                    (x) => x.area.toLowerCase() === a.nome.toLowerCase()
                  );
                  return (
                    <li key={a.id} className="flex items-center gap-2 text-sm">
                      <span
                        className={`inline-block w-2 h-2 ${
                          feito ? "bg-vermelho" : "bg-linha"
                        }`}
                        aria-hidden
                      />
                      <span className={feito ? "text-tinta" : "text-cinza"}>{a.nome}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
