# Tasks 001 — SpecGuard

Legenda: ✅ feito · ⬜ a fazer

## Fase 1 — CLI determinística (RF1–RF8)
- ✅ T001 Estrutura do repositório, constituição, CLAUDE.md
- ✅ T002 `parseSpec()` extrai RF/RNF/US — RF1
- ✅ T003 `parseTasks()` extrai T### e status — RF2
- ✅ T004 `scanRepo()` + `classifyFile()` código × teste — RF3
- ✅ T005 `linkExplicit()` com `@req` — RF4, RF5, RF6
- ✅ T006 `renderReport()` em Markdown — RF7
- ✅ T007 `specguard check` com exit code — RF8
- ✅ T008 Repositório de exemplo em `examples/demo-repo`
- ✅ T009 Marcar o próprio código do SpecGuard com `@req` e rodar dogfooding
- ⬜ T010 Publicar no GitHub + CI verde

## Fase 2 — Vínculo semântico (RF9)
- ⬜ T020 `docker compose up` com pgvector + embedder
- ⬜ T021 Endpoint `/embed` para requisitos e unidades de código (funções)
- ⬜ T022 Dividir arquivos TS/Python em unidades (função/classe)
- ⬜ T023 Busca top-k por requisito com `<=>` e limiar `--threshold`
- ⬜ T024 Status `sugerido` no relatório + testes

## Fase 3 — Veredito do Claude (RF10)
- ⬜ T030 Prompt que recebe requisito + trechos e devolve JSON `{status, justificativa, evidencias[]}`
- ⬜ T031 Validação com zod e retry
- ⬜ T032 Flag `--ai` e cache dos vereditos
- ⬜ T033 Testes com cliente mockado

## Fase 4 — Servidor MCP (RF11)
- ⬜ T040 Servidor stdio com `list_requirements`, `check_requirement`, `coverage_report`
- ⬜ T041 Configurar no Claude Code e gravar demo

## Fase 5 — CI e portfólio
- ⬜ T050 GitHub Action que roda `specguard check` e comenta no PR
- ⬜ T051 README com vídeo/GIF do antes/depois
- ⬜ T052 Post no LinkedIn
