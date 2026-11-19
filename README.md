# Irlanda — Bar (frontend)

Aplicação **separada** do convite principal, com identidade **Ireland — Mozambique (30 anos)**:

- **`/`** — menu
- **`/catalogo`** — catálogo **partilhado com o convite** (`GET /api/drinks`); pedido com mesa (`POST /api/drink-orders/open`)
- **`/felicitacoes/enviar`** — nome (máx. 10 caracteres) + mensagem (máx. 15 palavras)
- **`/felicitacoes`** — tela de apresentação (projector)

## API

Usa o **mesmo backend** `convite-api` (`POST /api/felicitacoes/open`, `POST /api/drink-orders/open`). **Reinicie o serviço na VPS** após actualizar o API. Em dev, proxy no `vite.config.ts`; em produção, `vercel.json` ou `VITE_API_URL`.

```bash
cd irlanda-bar
npm install
npm run dev
```

Abre [http://localhost:5174](http://localhost:5174).

## Deploy

1. Novo projeto na Vercel apontando para a pasta `irlanda-bar`.
2. Manter rewrites para a VPS (como em `vercel.json`).
3. **Não** abrir `/felicitacoes` e `/felicitacoes-tela` do convite ao mesmo tempo — partilham a fila de toasts.

## Design

Tema **claro** com logótipo «30» de fundo (`public/branding/logo-30.png`). Cores das bordas e botões: verde Irlanda `#169b62`, teal Moçambique `#007168`, laranja `#ff883e`, amarelo `#f4c430` (sem ouro nas molduras).