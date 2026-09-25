// @req US1 RF7 RF8 RNF3 — sem rede, sem banco, sem chave de API
import { readFileSync } from "node:fs";
import { relative } from "node:path";
import { findSpecFiles, scanRepo } from "./code/scan";
import { linkExplicit } from "./link/explicit";
import { exitCodeFor, renderReport } from "./report/markdown";
import { parseSpec, parseTasks } from "./spec/parse";

/** Orquestra: lê specs, varre código, vincula e gera relatório. */
export function check(root: string, ignore: string[] = []): { report: string; exitCode: number } {
  const { specs, tasks: taskFiles } = findSpecFiles(root);
  if (specs.length === 0) {
    return { report: `Nenhum spec.md encontrado em ${root}/specs\n`, exitCode: 2 };
  }
  const requirements = specs.flatMap((p) => parseSpec(readFileSync(p, "utf8"), relative(root, p)));
  const tasks = taskFiles.flatMap((p) => parseTasks(readFileSync(p, "utf8")));
  const result = linkExplicit(requirements, scanRepo(root, ignore), tasks);
  return { report: renderReport(result), exitCode: exitCodeFor(result) };
}
