// @req RF7 RF8
import type { LinkResult, RequirementStatus } from "../types";

const ICON: Record<RequirementStatus, string> = {
  testado: "✅ testado",
  implementado: "🟡 implementado (sem teste)",
  planejado: "🗓️ planejado",
  ausente: "❌ ausente",
};

const escape = (s: string) => s.replace(/\|/g, "\\|");
const short = (s: string, max = 90) => (s.length > max ? s.slice(0, max - 1).trimEnd() + "…" : s);
/** Remove o ID do início do texto: "RF1 — Criar" → "Criar". */
export const stripId = (text: string, id: string) =>
  text.startsWith(id) ? text.slice(id.length).replace(/^\s*[—–-]\s*/, "").trim() : text;
const list = (xs: string[]) => (xs.length ? xs.map((x) => `\`${x}\``).join("<br>") : "—");

export function summarize(result: LinkResult) {
  const counts: Record<RequirementStatus, number> = { testado: 0, implementado: 0, planejado: 0, ausente: 0 };
  for (const r of result.requirements) counts[r.status]++;
  const active = result.requirements.length - counts.planejado;
  const coverage = active === 0 ? 100 : Math.round(((counts.testado + counts.implementado) / active) * 100);
  const tested = active === 0 ? 100 : Math.round((counts.testado / active) * 100);
  return { counts, active, coverage, tested };
}

/** Código de saída para CI: 1 se houver requisito ausente. */
export function exitCodeFor(result: LinkResult): number {
  return result.requirements.some((r) => r.status === "ausente") ? 1 : 0;
}

export function renderReport(result: LinkResult, title = "SpecGuard — relatório de rastreabilidade"): string {
  const { counts, active, coverage, tested } = summarize(result);
  const lines: string[] = [
    `# ${title}`,
    "",
    `**Cobertura da spec:** ${coverage}% implementado · ${tested}% com teste (${active} requisitos ativos)`,
    "",
    `✅ ${counts.testado} testados · 🟡 ${counts.implementado} sem teste · ❌ ${counts.ausente} ausentes · 🗓️ ${counts.planejado} planejados`,
    "",
    "| Requisito | Status | Código | Testes |",
    "|---|---|---|---|",
    ...result.requirements.map(
      (r) =>
        `| **${r.requirement.id}** — ${escape(short(stripId(r.requirement.text, r.requirement.id)))} | ${ICON[r.status]} | ${list(r.codeFiles)} | ${list(r.testFiles)} |`,
    ),
  ];

  if (result.orphanFiles.length) {
    lines.push("", "## 🔶 Código fora da spec", "Arquivos sem nenhum `@req`:", "", ...result.orphanFiles.map((f) => `- \`${f}\``));
  }
  if (result.staleTasks.length) {
    lines.push(
      "",
      "## ⚠️ Tarefas concluídas com requisito ausente",
      "",
      ...result.staleTasks.map((t) => `- **${t.id}** — ${escape(stripId(t.text, t.id))} (cita ${t.refs.join(", ")})`),
    );
  }
  return lines.join("\n") + "\n";
}
