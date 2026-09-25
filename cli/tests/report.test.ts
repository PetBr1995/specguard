// @req RF7 RF8 RNF2
import { exitCodeFor, renderReport, stripId, summarize } from "../src/report/markdown";
import type { LinkResult, Requirement, RequirementStatus } from "../src/types";

const r = (id: string, status: RequirementStatus) => ({
  requirement: { id, kind: "RF", text: `${id} — Texto | com pipe`, specPath: "s", planned: status === "planejado" } as Requirement,
  codeFiles: status === "ausente" || status === "planejado" ? [] : ["src/a.ts"],
  testFiles: status === "testado" ? ["tests/a.test.ts"] : [],
  status,
});

const result: LinkResult = {
  requirements: [r("RF1", "testado"), r("RF2", "implementado"), r("RF3", "ausente"), r("RF4", "planejado")],
  orphanFiles: ["src/extra.ts"],
  staleTasks: [{ id: "T003", text: "excluir", done: true, refs: ["RF3"] }],
};

describe("summarize", () => {
  it("ignora planejados no cálculo de cobertura", () => {
    expect(summarize(result)).toMatchObject({ active: 3, coverage: 67, tested: 33 });
  });
  it("sem requisitos ativos = 100%", () => {
    expect(summarize({ requirements: [], orphanFiles: [], staleTasks: [] }).coverage).toBe(100);
  });
});

describe("exitCodeFor", () => {
  it("1 quando há ausente, 0 caso contrário", () => {
    expect(exitCodeFor(result)).toBe(1);
    expect(exitCodeFor({ ...result, requirements: [r("RF1", "testado"), r("RF4", "planejado")] })).toBe(0);
  });
});

describe("renderReport", () => {
  const md = renderReport(result);
  it("inclui resumo e tabela", () => {
    expect(md).toContain("67% implementado · 33% com teste");
    expect(md).toContain("| **RF1** — Texto \\| com pipe | ✅ testado | `src/a.ts` | `tests/a.test.ts` |");
    expect(md).toContain("| **RF3** — Texto \\| com pipe | ❌ ausente | — | — |");
  });
  it("lista código fora da spec e tarefas inconsistentes", () => {
    expect(md).toContain("## 🔶 Código fora da spec");
    expect(md).toContain("- `src/extra.ts`");
    expect(md).toContain("**T003**");
  });
  it("omite seções vazias", () => {
    const clean = renderReport({ ...result, orphanFiles: [], staleTasks: [] });
    expect(clean).not.toContain("Código fora da spec");
    expect(clean).not.toContain("Tarefas concluídas");
  });
});

describe("stripId", () => {
  it("remove o ID e o travessão do início", () => {
    expect(stripId("RF1 — Criar", "RF1")).toBe("Criar");
    expect(stripId("RF9 (fase 2) — Vetores", "RF9")).toBe("(fase 2) — Vetores");
    expect(stripId("Sem id", "RF1")).toBe("Sem id");
  });
  it("trunca textos longos com reticências", () => {
    const long = renderReport({ ...result, requirements: [{ ...result.requirements[0], requirement: { ...result.requirements[0].requirement, text: "RF1 — " + "x".repeat(200) } }] });
    expect(long).toContain("…");
  });
});
