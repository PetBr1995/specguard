# Plan 001 — SpecGuard

## Arquitetura

```
specs/**/spec.md ─► [spec parser] ─┐
specs/**/tasks.md ─► [task parser] ─┤
repo (código+testes) ─► [scanner] ──┼─► [linker] ─► [report] ─► Markdown / exit code
                                    │     ├ fase 1: @req explícito
                                    │     ├ fase 2: embeddings (embedder Python + pgvector)
                                    │     └ fase 3: veredito do Claude
                                    └─► fase 4: servidor MCP  ·  fase 5: GitHub Action
```

## Decisões
| Tema | Escolha | Motivo |
|---|---|---|
| Linguagem da CLI | TypeScript strict, sem framework de CLI | Poucas dependências, fácil de testar |
| Núcleo | Funções puras (`parseSpec`, `parseTasks`, `classifyFile`, `linkExplicit`, `renderReport`) | Testáveis sem I/O |
| Vínculo fase 1 | Regex `@req\s+([A-Z]+\d+)` em qualquer comentário | Determinístico, zero custo |
| Embeddings | FastAPI + sentence-transformers multilíngue (384d) | Grátis, local, pratica Python |
| Vetores | PostgreSQL 16 + pgvector, índice HNSW | SQL + busca semântica |
| LLM | Anthropic SDK, modelo via env | Integração real com Claude |
| MCP | `@modelcontextprotocol/sdk` (stdio) | Usar dentro do Claude Code |

## Modelo de dados (fase 2)
- `requirements(id, spec_path, req_id, text, embedding vector(384))`
- `code_units(id, path, kind, content, embedding vector(384))`

## Status de requisito
`testado` > `implementado` > `ausente` (fases 2–3 adicionam `sugerido` e `parcial`).
