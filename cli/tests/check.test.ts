// @req US1 RF3 RF8 RNF2
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { check } from "../src/check";

const demo = join(__dirname, "..", "..", "examples", "demo-repo");

describe("check (integração com examples/demo-repo)", () => {
  const { report, exitCode } = check(demo);

  it("gera relatório com todos os status", () => {
    expect(report).toContain("✅ testado");
    expect(report).toContain("🟡 implementado");
    expect(report).toContain("❌ ausente");
    expect(report).toContain("🗓️ planejado");
  });
  it("aponta código fora da spec e tarefa inconsistente", () => {
    expect(report).toContain("src/legacy.ts");
    expect(report).toContain("**T004**");
  });
  it("falha o CI porque há requisito ausente", () => {
    expect(exitCode).toBe(1);
  });
  it("retorna 2 quando não há specs", () => {
    expect(check(mkdtempSync(join(tmpdir(), "sg-"))).exitCode).toBe(2);
  });
});

describe("check com --ignore", () => {
  it("ignora pastas informadas", () => {
    const { report } = check(demo, ["src"]);
    expect(report).not.toContain("src/legacy.ts");
  });
});
