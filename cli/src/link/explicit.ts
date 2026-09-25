// @req US2 RF4 RF5 RF6 RF8b
import type { LinkResult, Requirement, RequirementResult, SourceFile, Task } from "../types";

const REQ_TAG = /@req\s+((?:(?:RNF|RF|US)\d+[a-z]?[ \t,]*)+)/g;
const REQ_ID = /\b(?:RNF|RF|US)\d+[a-z]?\b/g;

/** IDs de requisito marcados com `@req` em um arquivo. */
export function extractReqTags(content: string): string[] {
  const ids = new Set<string>();
  for (const m of content.matchAll(REQ_TAG)) {
    for (const id of m[1].match(REQ_ID) ?? []) ids.add(id);
  }
  return [...ids];
}

/** Vincula requisitos a arquivos por marcação explícita e classifica o status. */
export function linkExplicit(requirements: Requirement[], files: SourceFile[], tasks: Task[] = []): LinkResult {
  const tagsByFile = new Map(files.map((f) => [f.path, extractReqTags(f.content)]));

  const results: RequirementResult[] = requirements.map((requirement) => {
    const linked = files.filter((f) => tagsByFile.get(f.path)!.includes(requirement.id));
    const codeFiles = linked.filter((f) => !f.isTest).map((f) => f.path);
    const testFiles = linked.filter((f) => f.isTest).map((f) => f.path);
    const status =
      testFiles.length > 0 ? "testado" : codeFiles.length > 0 ? "implementado" : requirement.planned ? "planejado" : "ausente";
    return { requirement, codeFiles, testFiles, status };
  });

  const orphanFiles = files.filter((f) => !f.isTest && tagsByFile.get(f.path)!.length === 0).map((f) => f.path);

  const missing = new Set(results.filter((r) => r.status === "ausente").map((r) => r.requirement.id));
  const staleTasks = tasks.filter((t) => t.done && t.refs.some((id) => missing.has(id)));

  return { requirements: results, orphanFiles, staleTasks };
}
