/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
    testEnvironment: 'node',
    preset: 'ts-jest',
    verbose: true,
    collectCoverage: true,
    coverageProvider: 'v8',
    collectCoverageFrom: ['src/**/*.ts', '!test/**', '!src/**/__mocks__/*', '!**/node_modules/**'],
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {}]
    },
    testMatch: ['**/tests/**/*.spec.ts']
}
