module.exports = {
  testPathIgnorePatterns: ["/.next/", "/node_modules/"],
  setupFilesAfterEnv: ["<rootDir>/src/utils/setupTests.ts"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
  },
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(scss|css|sass)$": "identity-obj-proxy",
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.tsx",
    "!src/**/*.spec.tsx",
    "!src/**/_app.tsx",
    "!src/**/_document.tsx",
    "!src/utils/tests/*.tsx",
  ],
  coverageReporters: ["lcov", "json"],
};
