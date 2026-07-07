# Mapa dos 11 Inegociáveis™

App conversacional do Pilar 1 (Poder da Decisão) do método DOMA, de Andréia Assis. Conduz a pessoa a nomear os 11 inegociáveis e sair com o Mapa completo. A leitura das tensões entre eles fica reservada à conversa diagnóstica com a Andréia: a ferramenta nomeia, nunca resolve.

## Stack

Next.js 14 (App Router) + Tailwind. API da Anthropic chamada por rota de servidor (`app/api/chat/route.ts`), modelo Sonnet. Estado da jornada em `localStorage`, com botão de retomada. Export do Mapa em PDF via impressão do navegador.

## Rodar localmente

```bash
npm install
cp .env.example .env.local   # e coloque a chave real
npm run dev
```

## Deploy na Vercel

1. Suba este repositório no GitHub.
2. Importe na Vercel (mesmo fluxo do andreia-assis-site e do mapa-rotas-valorizacao).
3. Em Settings > Environment Variables, crie `ANTHROPIC_API_KEY` com a chave da Anthropic.
4. Deploy. Auto-deploy fica ativo a cada push.

## Onde ajustar sem tocar no fluxo

- `lib/config.ts`: WhatsApp e e-mail da ponte final, modelo, nome do produto, janela de mensagens.
- `lib/systemPrompt.ts`: o motor conversacional. As regras da fase 4 (as três travas) e a regra vertical da fase 5 estão marcadas e não devem ser afrouxadas sem decisão consciente.
- `lib/areas.ts`: a taxonomia oficial das 11 áreas e os três blocos.

## A linha da dependência (para quem mantiver o código)

A fase 4 nomeia no máximo três tensões, apenas quando duas frases da própria pessoa disputam o mesmo recurso concreto, com as palavras dela. É proibido dizer qual inegociável governa, explicar a origem da colisão ou sugerir caminho. A fase 5 opera na vertical, dentro de cada área, nunca entre áreas. Essas regras existem para que a pessoa saia com valor real e com a percepção honesta de que a camada funda pertence ao trabalho humano.

## Preparado para o futuro

Sem paywall nesta versão. A captura de identificação e o gateway de pagamento podem ser plugados na tela inicial (`app/page.tsx`, bloco `!iniciado`) sem reescrever o fluxo conversacional.
