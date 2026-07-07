// Ajustes de produto em um lugar só, para a Andréia trocar sem mexer no fluxo.

export const CONFIG = {
  nomeProduto: "Mapa dos 11 Inegociáveis™",
  mentora: "Andréia Assis",
  // Ponte do funil ao final da jornada:
  contatoWhatsApp: "https://wa.me/5511976218884",
  contatoEmail: "andreia@louresvale.com",
  // Modelo usado na conversa (Sonnet para custo e velocidade):
  modelo: "claude-sonnet-4-6",
  maxTokensPorTurno: 1024,
  // Quantas mensagens recentes vão para a API a cada turno (o resto vive no estado):
  janelaMensagens: 14,
};
