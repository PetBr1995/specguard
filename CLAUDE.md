# CLAUDE.md — instruções para o Claude Code

## Contexto
SpecGuard: detecta *spec drift* entre specs do Spec Kit e o código.
Leia antes de qualquer tarefa: `.specify/memory/constitution.md` e `specs/001-specguard-mvp/`.

## Estrutura
- `cli/` — Node 20+, TypeScript strict, Jest. Núcleo puro em `src/spec`, `src/code`, `src/link`, `src/report`.
- `embedder/` — Python 3.11, FastAPI, sentence-transformers, pytest (fase 2).
- `db/init.sql` — PostgreSQL 16 + pgvector (fase 2).
- `examples/demo-repo/` — repositório de exemplo para testar a CLI.

## Comandos
- Testes CLI: `cd cli && npm test`
- Rodar na demo: `cd cli && npm run check -- ../examples/demo-repo`
- Testes embedder: `cd embedder && pytest`

## Regras
- Trabalhe uma tarefa de `tasks.md` por vez; marque ✅ ao terminar.
- Toda função nova no núcleo nasce com teste.
- Todo arquivo de produção tem comentário `@req <ID>` do requisito que atende.
- Não adicione dependências sem registrar no `plan.md`.
- Nunca leia nem escreva `.env`.
