// @req RF3
export const SOURCE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".py"];
export const IGNORED_DIRS = new Set(["node_modules", "dist", "build", ".git", "coverage", "__pycache__", ".venv"]);

export function isSourceFile(path: string): boolean {
  if (path.endsWith(".d.ts")) return false;
  return SOURCE_EXTENSIONS.some((ext) => path.endsWith(ext));
}

/** Decide se um arquivo (caminho relativo, com "/") é de teste. */
export function isTestFile(path: string): boolean {
  const p = path.replace(/\\/g, "/");
  return (
    /(^|\/)(tests?|__tests__)\//.test(p) ||
    /\.(test|spec)\.[jt]sx?$/.test(p) ||
    /(^|\/)test_[^/]+\.py$/.test(p) ||
    /_test\.py$/.test(p)
  );
}

/** Configs de ferramenta não precisam de @req. */
export function isConfigFile(path: string): boolean {
  return /(^|\/)(jest|vite|vitest|eslint|prettier|babel|webpack|tailwind|postcss)\.config\.[cm]?[jt]s$/.test(path) || /(^|\/)conftest\.py$/.test(path);
}
