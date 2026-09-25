// @req RF1 RF2 RNF2
import { parseSpec, parseTasks } from "../src/spec/parse";

describe("parseSpec", () => {
  const md = [
    "# Spec",
    "## Requisitos",
    "- **RF1** — Cadastrar tarefa",
    "- **RF2** — Listar tarefas (fase 2)",
    "- **RNF1** — Resposta em até 200 ms",
    "- **US1** — Como usuário, crio tarefas",
    "- Conforme RF1, validar título", // citação, não definição
    "- **RF1** — duplicado ignorado",
    "Texto solto com RF9 não é item de lista",
  ].join("\n");

  const reqs = parseSpec(md, "specs/001/spec.md");

  it("extrai RF, RNF e US na ordem", () => {
    expect(reqs.map((r) => r.id)).toEqual(["RF1", "RF2", "RNF1", "US1"]);
  });
  it("define o tipo e o caminho da spec", () => {
    expect(reqs[2]).toMatchObject({ kind: "RNF", specPath: "specs/001/spec.md" });
  });
  it("limpa markdown do texto", () => {
    expect(reqs[0].text).toBe("RF1 — Cadastrar tarefa");
  });
  it("marca requisitos de fases futuras como planejados", () => {
    expect(reqs[1].planned).toBe(true);
    expect(reqs[0].planned).toBe(false);
  });
});

describe("parseTasks", () => {
  const md = [
    "- ✅ T001 Criar modelo — RF1",
    "- [x] T002 Rota de listagem RF2, US1",
    "- ⬜ T003 Testes de carga — RNF1",
    "- [ ] T004 Documentação",
    "T005 fora de lista é ignorada",
  ].join("\n");
  const tasks = parseTasks(md);

  it("extrai tarefas de itens de lista", () => {
    expect(tasks.map((t) => t.id)).toEqual(["T001", "T002", "T003", "T004"]);
  });
  it("detecta concluídas com ✅ ou [x]", () => {
    expect(tasks.map((t) => t.done)).toEqual([true, true, false, false]);
  });
  it("coleta requisitos citados", () => {
    expect(tasks[1].refs).toEqual(["RF2", "US1"]);
    expect(tasks[3].refs).toEqual([]);
  });
});

describe("limpeza de texto", () => {
  it("mantém ✅ no meio do texto e remove só o do início", () => {
    expect(parseTasks("- ✅ T010 Aceita ✅ ou [x]")[0].text).toBe("T010 Aceita ✅ ou [x]");
  });
});
