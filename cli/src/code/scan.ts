// @req RF3
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import type { SourceFile } from "../types";
import { IGNORED_DIRS, isConfigFile, isSourceFile, isTestFile } from "./classify";

/** Percorre o repositório e devolve os arquivos-fonte (I/O — borda do sistema). */
export function scanRepo(root: string, ignore: string[] = []): SourceFile[] {
  const ignored = new Set([...IGNORED_DIRS, ...ignore]);
  const files: SourceFile[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (!ignored.has(entry.name) && !entry.name.startsWith(".")) walk(join(dir, entry.name));
        continue;
      }
      const rel = relative(root, join(dir, entry.name)).replace(/\\/g, "/");
      if (!isSourceFile(rel) || isConfigFile(rel)) continue;
      files.push({ path: rel, isTest: isTestFile(rel), content: readFileSync(join(dir, entry.name), "utf8") });
    }
  };
  walk(root);
  return files.sort((a, b) => a.path.localeCompare(b.path));
}

/** Encontra todos os spec.md e tasks.md dentro de specs/. */
export function findSpecFiles(root: string): { specs: string[]; tasks: string[] } {
  const specs: string[] = [];
  const tasks: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name === "spec.md") specs.push(full);
      else if (entry.name === "tasks.md") tasks.push(full);
    }
  };
  try {
    walk(join(root, "specs"));
  } catch {
    // sem pasta specs/
  }
  return { specs: specs.sort(), tasks: tasks.sort() };
}
