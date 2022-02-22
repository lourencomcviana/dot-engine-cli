/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  "preset": "ts-jest",
  "testEnvironment": "node",
  "verbose": true,
  "moduleNameMapper": {
    "^@app/(.*)": "<rootDir>/src/$1",
    "^Components/(.*)": "<rootDir>/src/components/$1"
  }
};
