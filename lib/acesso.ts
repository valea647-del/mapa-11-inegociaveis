// Controle de acesso do app.
//
// HOJE: códigos de acesso definidos na variável de ambiente CODIGOS_DE_ACESSO,
// separados por vírgula. Exemplo: "MENTORIA2026,PALESTRA-BNI,VIP".
// Para revogar um código, basta removê-lo da variável na Vercel e fazer redeploy.
// Se a variável estiver vazia ou ausente, o app fica aberto (sem porta).
//
// AMANHÃ (paywall): este é o único lugar que precisa mudar. A função
// validarAcesso passa a aceitar também um token de compra (por exemplo, o id
// de uma sessão do Stripe ou um código gerado após o pagamento) e a consultar
// a lista de compradores. O fluxo conversacional não muda em nada.

export function codigosValidos(): string[] {
  const bruto = process.env.CODIGOS_DE_ACESSO || "";
  return bruto
    .split(",")
    .map((c) => c.trim().toUpperCase())
    .filter(Boolean);
}

export function acessoAberto(): boolean {
  return codigosValidos().length === 0;
}

export function validarAcesso(codigo: string | null | undefined): boolean {
  if (acessoAberto()) return true;
  if (!codigo) return false;
  return codigosValidos().includes(codigo.trim().toUpperCase());
}
