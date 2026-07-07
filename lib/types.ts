export interface AreaEstado {
  area: string;
  bloco: string;
  inegociavel: string;
}

export interface Estado {
  fase: 1 | 2 | 3 | 4 | 5;
  concluido: boolean;
  nome: string;
  email: string;
  espelho: string;
  diagnostico: Record<string, number> | null;
  areas: AreaEstado[];
  tensoes: string[];
  integracao: { metas_90_dias: string; accountability: string };
  concluido_em: string | null;
}

export interface Mensagem {
  role: "user" | "assistant";
  content: string;
}

export function estadoInicial(): Estado {
  return {
    fase: 1,
    concluido: false,
    nome: "",
    email: "",
    espelho: "",
    diagnostico: null,
    areas: [],
    tensoes: [],
    integracao: { metas_90_dias: "", accountability: "" },
    concluido_em: null,
  };
}
