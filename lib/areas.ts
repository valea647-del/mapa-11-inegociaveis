export type Bloco = "Interno" | "Ambiente" | "Propósito";

export interface Area {
  id: string;
  nome: string;
  bloco: Bloco;
}

export const AREAS: Area[] = [
  { id: "saude", nome: "Saúde", bloco: "Interno" },
  { id: "intelectual", nome: "Intelectual", bloco: "Interno" },
  { id: "emocional", nome: "Emocional", bloco: "Interno" },
  { id: "espiritual", nome: "Espiritual", bloco: "Interno" },
  { id: "carreira", nome: "Carreira", bloco: "Ambiente" },
  { id: "financeira", nome: "Vida Financeira", bloco: "Ambiente" },
  { id: "social", nome: "Vida Social", bloco: "Ambiente" },
  { id: "familiar", nome: "Vida Familiar", bloco: "Ambiente" },
  { id: "visao_de_vida", nome: "Visão de Vida", bloco: "Propósito" },
  { id: "qualidade_de_vida", nome: "Qualidade de Vida", bloco: "Propósito" },
  { id: "relacionamento_amoroso", nome: "Relacionamento Amoroso", bloco: "Propósito" },
];

export const BLOCOS: { nome: Bloco; rotulo: string }[] = [
  { nome: "Interno", rotulo: "Desenvolvimento pessoal" },
  { nome: "Ambiente", rotulo: "Relações e carreira" },
  { nome: "Propósito", rotulo: "Realização e propósito" },
];
