import { NextRequest, NextResponse } from "next/server";
import { montarSystemPrompt } from "@/lib/systemPrompt";
import { CONFIG } from "@/lib/config";
import { Estado, Mensagem } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { erro: "ANTHROPIC_API_KEY não configurada no servidor." },
      { status: 500 }
    );
  }

  let corpo: { mensagens: Mensagem[]; estado: Estado };
  try {
    corpo = await req.json();
  } catch {
    return NextResponse.json({ erro: "Corpo inválido." }, { status: 400 });
  }

  const { mensagens, estado } = corpo;
  if (!Array.isArray(mensagens) || mensagens.length === 0) {
    return NextResponse.json({ erro: "Sem mensagens." }, { status: 400 });
  }

  // Janela enxuta: o histórico antigo vive no objeto de estado, não na conversa.
  const janela = mensagens.slice(-CONFIG.janelaMensagens);

  const resposta = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: CONFIG.modelo,
      max_tokens: CONFIG.maxTokensPorTurno,
      system: montarSystemPrompt(estado),
      messages: janela.map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  if (!resposta.ok) {
    const detalhe = await resposta.text();
    return NextResponse.json(
      { erro: "Falha na chamada ao modelo.", detalhe },
      { status: 502 }
    );
  }

  const dados = await resposta.json();
  const texto = (dados.content || [])
    .filter((b: { type: string }) => b.type === "text")
    .map((b: { text: string }) => b.text)
    .join("\n");

  return NextResponse.json({ texto });
}
