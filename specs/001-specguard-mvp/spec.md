# Spec 001 — SpecGuard (MVP)

## Problema
Em Spec-Driven Development (Spec Kit + Claude Code), a especificação e o código se afastam com o tempo (**spec drift**): requisitos ficam sem implementação, tarefas marcadas como feitas não têm teste e surge código que nenhuma spec pede. Hoje isso só é conferido lendo tudo manualmente.

## Objetivo
Uma ferramenta que lê as specs de um repositório (`specs/**/spec.md` e `tasks.md`), analisa o código e os testes, e gera um **relatório de rastreabilidade**: para cada requisito, se está implementado, testado ou ausente, e qual código não se liga a nenhum requisito.

## Usuários
- Dev que usa Spec Kit/SDD com agentes de código (Claude Code).
- Revisor de PR que quer saber se a entrega cobre a spec.

## Histórias de usuário
- **US1** — Como dev, rodo `specguard check <repo>` e recebo um relatório Markdown com o status de cada requisito.
- **US2** — Como dev, marco explicitamente um trecho de código/teste com `@req RF1` e o SpecGuard usa isso como vínculo garantido.
- **US3** — (fase 2) Como dev, mesmo sem marcações, o SpecGuard sugere vínculos por **similaridade semântica** (embeddings + pgvector).
- **US4** — (fase 3) Como dev, peço ao Claude um veredito por requisito (implementado / parcial / ausente) com justificativa e trechos citados.
- **US5** — (fase 4) Como dev, dentro do Claude Code, pergunto "o que falta da spec 001?" e o SpecGuard responde via **servidor MCP**.
- **US6** — (fase 5) Como revisor, o SpecGuard comenta o relatório no pull request (GitHub Action).

## Requisitos funcionais
- **RF1** — Extrair requisitos de `spec.md`: identificadores `RF\d+`, `RNF\d+` e `US\d+`, com o texto da linha.
- **RF2** — Extrair tarefas de `tasks.md`: identificador `T\d+`, texto e se está concluída (`✅` ou `[x]`).
- **RF3** — Varrer o repositório (`.ts`, `.tsx`, `.js`, `.py`), ignorando `node_modules`, `dist` e `.git`, separando arquivos de código e de teste.
- **RF4** — Vincular requisitos a arquivos por marcação explícita `@req <ID>` em comentários.
- **RF5** — Classificar cada requisito: `testado` (vínculo em teste), `implementado` (só em código), `ausente` (sem vínculo).
- **RF6** — Listar arquivos de código sem nenhum vínculo como "código fora da spec".
- **RF7** — Gerar relatório Markdown com tabela de requisitos e resumo percentual.
- **RF8** — Código de saída `1` quando houver requisito `ausente` (útil no CI), `0` caso contrário. Requisitos marcados como `(fase N)` e ainda sem vínculo aparecem como `planejado` e não quebram o CI.
- **RF8b** — Alertar tarefas marcadas como concluídas (✅/[x]) que citam um requisito ainda `ausente`.
- **RF9** (fase 2) — Vínculo semântico via embeddings com limiar configurável.
- **RF10** (fase 3) — Veredito do Claude por requisito, em JSON validado, citando trechos.
- **RF11** (fase 4) — Servidor MCP com tools `list_requirements`, `check_requirement`, `coverage_report`.

## Requisitos não funcionais
- **RNF1** — CLI em Node.js + TypeScript `strict`; embeddings em Python/FastAPI.
- **RNF2** — Funções puras com testes (Jest/pytest); cobertura ≥ 80% no núcleo.
- **RNF3** — A fase 1 funciona **sem** chave de API e sem banco (determinística).
- **RNF4** — (fase 3) Chaves de API só por variável de ambiente.

## Fora do escopo (MVP)
Outras linguagens além de TS/JS/Python, UI web, suporte a monorepos complexos.

## Critérios de aceite
- [ ] `specguard check examples/demo-repo` gera o relatório com pelo menos um requisito de cada status.
- [ ] O próprio SpecGuard passa no SpecGuard (dogfooding) no CI.
- [ ] README com vídeo curto do antes/depois.
