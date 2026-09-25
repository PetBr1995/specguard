// @req RF3 RNF2
import { isConfigFile, isSourceFile, isTestFile } from "../src/code/classify";

describe("isTestFile", () => {
  it.each([
    ["tests/app.test.ts", true],
    ["src/__tests__/x.ts", true],
    ["src/user.spec.tsx", true],
    ["embedder/tests/test_chunking.py", true],
    ["pkg/chunk_test.py", true],
    ["src/app.ts", false],
    ["src/contest.py", false],
  ])("%s → %s", (path, expected) => {
    expect(isTestFile(path)).toBe(expected);
  });
});

describe("isSourceFile", () => {
  it("aceita TS/JS/Python e ignora .d.ts e outros", () => {
    expect(isSourceFile("a.ts")).toBe(true);
    expect(isSourceFile("a.py")).toBe(true);
    expect(isSourceFile("types.d.ts")).toBe(false);
    expect(isSourceFile("README.md")).toBe(false);
  });
});

describe("isConfigFile", () => {
  it("reconhece configs de ferramenta", () => {
    expect(isConfigFile("cli/jest.config.js")).toBe(true);
    expect(isConfigFile("embedder/conftest.py")).toBe(true);
    expect(isConfigFile("src/config.ts")).toBe(false);
  });
});
