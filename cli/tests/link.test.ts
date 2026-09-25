// @req US2 RF4 RF5 RF6 RF8b RNF2
import { extractReqTags, linkExplicit } from "../src/link/explicit";
import type { Requirement, SourceFile, Task } from "../src/types";

// "@" + "req" evita que as fixtures contem como vínculos quando o SpecGuard analisa a si mesmo
const TAG = "@" + "req";

const req = (id: string, planned = false): Requirement => ({
  id,
  kind: id.startsWith("US") ? "US" : id.startsWith("RNF") ? "RNF" : "RF",
  text: id,
  specPath: "spec.md",
  planned,
});

describe("extractReqTags", () => {
  it("lê um ou vários IDs por marcação", () => {
    expect(extractReqTags(`// ${TAG} RF1\n# ${TAG} RF2, US3 RNF1`)).toEqual(["RF1", "RF2", "US3", "RNF1"]);
  });
  it("não junta IDs da linha seguinte", () => {
    expect(extractReqTags(`// ${TAG} RF1\nRF9 aparece no código`)).toEqual(["RF1"]);
  });
  it("ignora arquivos sem marcação", () => {
    expect(extractReqTags("const x = 1")).toEqual([]);
  });
});

describe("linkExplicit", () => {
  const files: SourceFile[] = [
    { path: "src/create.ts", isTest: false, content: `// ${TAG} RF1` },
    { path: "tests/create.test.ts", isTest: true, content: `// ${TAG} RF1` },
    { path: "src/list.ts", isTest: false, content: `// ${TAG} RF2` },
    { path: "src/util.ts", isTest: false, content: "export const x = 1" },
  ];
  const tasks: Task[] = [
    { id: "T001", text: "criar", done: true, refs: ["RF1"] },
    { id: "T003", text: "excluir", done: true, refs: ["RF3"] },
    { id: "T004", text: "futuro", done: false, refs: ["RF3"] },
  ];
  const result = linkExplicit([req("RF1"), req("RF2"), req("RF3"), req("RF4", true)], files, tasks);
  const status = Object.fromEntries(result.requirements.map((r) => [r.requirement.id, r.status]));

  it("classifica testado, implementado, ausente e planejado", () => {
    expect(status).toEqual({ RF1: "testado", RF2: "implementado", RF3: "ausente", RF4: "planejado" });
  });
  it("separa arquivos de código e de teste", () => {
    expect(result.requirements[0]).toMatchObject({ codeFiles: ["src/create.ts"], testFiles: ["tests/create.test.ts"] });
  });
  it("aponta código fora da spec", () => {
    expect(result.orphanFiles).toEqual(["src/util.ts"]);
  });
  it("alerta tarefa concluída cujo requisito está ausente", () => {
    expect(result.staleTasks.map((t) => t.id)).toEqual(["T003"]);
  });
});
