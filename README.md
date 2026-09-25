# SpecGuard

> Detecta **spec drift**: o que a spec promete × o que o código entrega.

Em Spec-Driven Development (Spec Kit + Claude Code), specs e código se afastam com o tempo: requisitos ficam sem implementação, tarefas são marcadas ✅ sem teste e aparece código que nenhuma spec pede. O **SpecGuard** lê `specs/**/spec.md` e `tasks.md`, analisa o repositório e gera um relatório de rastreabilidade — e quebra o CI quando algo prometido não foi entregue.

## Exemplo
```bash
cd cli && npm install
npm run check -- ../examples/demo-repo
```
```
**Cobertura da spec:** 67% implementado · 33% com teste (3 requisitos ativos)

| Requisito | Status |
|---|---|
| RF1 — Criar tarefa com título obrigatório | ✅ testado |
| RF2 — Listar tarefas | 🟡 implementado (sem teste) |
| RF3 — Excluir tarefa pelo id | ❌ ausente |
| RF4 — Exportar tarefas em CSV (fase 2) | 🗓️ planejado |

🔶 Código fora da spec: src/legacy.ts
⚠️ T004 está ✅ mas o RF3 não existe no código
```

## Como vincular código a requisitos
Adicione um comentário no arquivo:
```ts
// @req RF1 RF2
```
```python
# @req RF3
```

## Dogfooding
O próprio SpecGuard é desenvolvido com SDD e verificado por ele mesmo no CI:
`npm run check -- .. --ignore examples,embedder`

## Roadmap
| Fase | Entrega | Stack |
|---|---|---|
| 1 ✅ | CLI determinística com `@req` | TypeScript, Jest |
| 2 | Vínculo semântico (sem marcações) | Python/FastAPI, embeddings, PostgreSQL + pgvector |
| 3 | Veredito do Claude por requisito, citando trechos | Anthropic SDK |
| 4 | Servidor MCP para usar dentro do Claude Code | MCP SDK |
| 5 | GitHub Action que comenta no PR | GitHub Actions |

Detalhes em `specs/001-specguard-mvp/`.

## Feito com
Claude Code · Spec Kit (SDD) · TypeScript · Python · PostgreSQL/pgvector · Jest · pytest
