import { Estado } from "./types";
import { AREAS } from "./areas";

// Extrai as tags de controle da resposta do modelo, atualiza o estado
// e devolve o texto limpo para exibição.
export function processarResposta(texto: string, estado: Estado): { limpo: string; estado: Estado } {
  const novo: Estado = JSON.parse(JSON.stringify(estado));
  let limpo = texto;

  // <inegociavel area="X">frase</inegociavel>
  const reIneg = /<inegociavel\s+area="([^"]+)">([\s\S]*?)<\/inegociavel>/g;
  let m: RegExpExecArray | null;
  while ((m = reIneg.exec(texto)) !== null) {
    const nomeArea = m[1].trim();
    const frase = m[2].trim();
    const def = AREAS.find((a) => a.nome.toLowerCase() === nomeArea.toLowerCase());
    const bloco = def ? def.bloco : "";
    const existente = novo.areas.find((a) => a.area.toLowerCase() === nomeArea.toLowerCase());
    if (existente) {
      existente.inegociavel = frase;
    } else {
      novo.areas.push({ area: def ? def.nome : nomeArea, bloco, inegociavel: frase });
    }
  }

  // <tensao>...</tensao>
  const reTen = /<tensao>([\s\S]*?)<\/tensao>/g;
  while ((m = reTen.exec(texto)) !== null) {
    const t = m[1].trim();
    if (t && !novo.tensoes.includes(t)) novo.tensoes.push(t);
  }

  // <integracao metas="..." accountability="..."/>
  const reInt = /<integracao\s+metas="([^"]*)"\s+accountability="([^"]*)"\s*\/>/g;
  while ((m = reInt.exec(texto)) !== null) {
    novo.integracao.metas_90_dias = m[1].trim();
    novo.integracao.accountability = m[2].trim();
  }

  // <fase>N</fase>
  const reFase = /<fase>(\d)<\/fase>/g;
  while ((m = reFase.exec(texto)) !== null) {
    const f = parseInt(m[1], 10);
    if (f >= 1 && f <= 5 && f > novo.fase) novo.fase = f as Estado["fase"];
  }

  // <fim/>
  if (/<fim\s*\/>/.test(texto)) {
    novo.concluido = true;
    novo.concluido_em = new Date().toISOString();
  }

  limpo = limpo
    .replace(reIneg, "")
    .replace(reTen, "")
    .replace(reInt, "")
    .replace(reFase, "")
    .replace(/<fim\s*\/>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return { limpo, estado: novo };
}
