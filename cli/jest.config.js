module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  collectCoverageFrom: ["src/**/*.ts", "!src/cli.ts"],
  coverageThreshold: { global: { lines: 80 } },
};
