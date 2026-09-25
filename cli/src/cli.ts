#!/usr/bin/env node
// @req US1 RF8 RNF1
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { check } from "./check";

const USAGE = "Uso: specguard check <caminho-do-repo> [--out relatorio.md] [--ignore pasta1,pasta2]";

function main(argv: string[]): number {
  const [command, repo, ...rest] = argv;
  if (command !== "check" || !repo) {
    console.error(USAGE);
    return 2;
  }
  const outIdx = rest.indexOf("--out");
  const ignIdx = rest.indexOf("--ignore");
  const ignore = ignIdx >= 0 && rest[ignIdx + 1] ? rest[ignIdx + 1].split(",").map((s) => s.trim()) : [];
  const { report, exitCode } = check(resolve(repo), ignore);
  if (outIdx >= 0 && rest[outIdx + 1]) writeFileSync(rest[outIdx + 1], report);
  process.stdout.write(report);
  return exitCode;
}

process.exitCode = main(process.argv.slice(2));
