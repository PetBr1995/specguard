// @req RF1 RF2 RF3 RF5
export type RequirementKind = "RF" | "RNF" | "US";

export interface Requirement {
  id: string; // ex.: "RF1"
  kind: RequirementKind;
  text: string;
  specPath: string;
  planned: boolean; // marcado como "(fase N)"
}

export interface Task {
  id: string; // ex.: "T001"
  text: string;
  done: boolean;
  refs: string[]; // requisitos citados na linha
}

export interface SourceFile {
  path: string; // relativo à raiz do repo
  isTest: boolean;
  content: string;
}

export type RequirementStatus = "testado" | "implementado" | "planejado" | "ausente";

export interface RequirementResult {
  requirement: Requirement;
  codeFiles: string[];
  testFiles: string[];
  status: RequirementStatus;
}

export interface LinkResult {
  requirements: RequirementResult[];
  orphanFiles: string[]; // código sem nenhum @req
  staleTasks: Task[]; // tarefas ✅ que citam requisito ausente
}
