# Constituição — SpecGuard

1. **Spec primeiro.** Nenhuma feature sem spec/plan/tasks. O SpecGuard é verificado por ele mesmo.
2. **Todo código de produção referencia um requisito** com `@req <ID>`.
3. **Núcleo puro e testado.** Parsing, vínculo e relatório não fazem I/O; I/O fica nas bordas (CLI, embedder, MCP).
4. **Determinístico antes de IA.** O que dá para resolver com regra não vai para o LLM.
5. **IA honesta.** O Claude só julga com trechos fornecidos e sempre cita evidências.
6. **Segredos fora do repositório.**
7. **Commits convencionais** (`feat:`, `fix:`, `test:`, `docs:`).
