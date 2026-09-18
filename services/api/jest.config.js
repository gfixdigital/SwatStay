/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testRegex: ".*\\.spec\\.ts$",
  transform: { "^.+\\.ts$": "ts-jest" },
  collectCoverageFrom: ["src/**/*.ts", "!src/main.ts"],
  testEnvironment: "node",
};
