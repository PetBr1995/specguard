// @req RF1 RF2
import type { Requirement, RequirementKind, Task } from "../types";

const REQ_ID = /\b(RNF|RF|US)(\d+[a-z]?)\b/;
const REQ_ID_GLOBAL = /\b(?:RNF|RF|US)\d+[a-z]?\b/g;
const LIST_OR_HEADING = /^\s*(?:[-*+]|\d+\.|#{1,6})\s+/;
const TASK_ID = /\b(T\d{3,})\b/;
const PLANNED = /\(fase\s*\d+\)/i;

function cleanLine(line: string): string {
  return line
    .replace(LIST_OR_HEADING, "")
    .replace(/^(?:[✅⬜]\s*|\[[ xX]\]\s*)/, "")
    .replace(/\*\*/g, "")
    .trim();
}

/** Extrai requisitos (RF/RNF/US) de um spec.md. A primeira ocorrência de cada ID define o requisito. */
export function parseSpec(markdown: string, specPath: string): Requirement[] {
  const seen = new Map<string, Requirement>();
  for (const line of markdown.split(/\r?\n/)) {
    if (!LIST_OR_HEADING.test(line)) continue;
    const text = cleanLine(line);
    const m = REQ_ID.exec(text);
    // o ID precisa estar no começo do item para ser uma definição (não uma citação)
    if (!m || m.index > 2) continue;
    const id = `${m[1]}${m[2]}`;
    if (seen.has(id)) continue;
    seen.set(id, {
      id,
      kind: m[1] as RequirementKind,
      text,
      specPath,
      planned: PLANNED.test(text),
    });
  }
  return [...seen.values()];
}

/** Extrai tarefas (T###) de um tasks.md, com status e requisitos citados. */
export function parseTasks(markdown: string): Task[] {
  const tasks: Task[] = [];
  for (const line of markdown.split(/\r?\n/)) {
    const m = TASK_ID.exec(line);
    if (!m || !LIST_OR_HEADING.test(line)) continue;
    const done = /✅|\[[xX]\]/.test(line);
    const text = cleanLine(line);
    const refs = [...new Set(text.match(REQ_ID_GLOBAL) ?? [])];
    tasks.push({ id: m[1], text, done, refs });
  }
  return tasks;
}
