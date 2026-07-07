import { NextRequest, NextResponse } from "next/server";
import { validarAcesso, acessoAberto } from "@/lib/acesso";

export const runtime = "nodejs";

// GET: informa se o app exige código (para a tela inicial saber o que mostrar).
export async function GET() {
  return NextResponse.json({ exigeCodigo: !acessoAberto() });
}

// POST: valida um código digitado.
export async function POST(req: NextRequest) {
  let corpo: { codigo?: string };
  try {
    corpo = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const ok = validarAcesso(corpo.codigo);
  return NextResponse.json({ ok }, { status: ok ? 200 : 401 });
}
