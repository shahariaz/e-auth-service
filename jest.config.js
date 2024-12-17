/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
    testEnvironment: 'node',
    preset: 'ts-jest',
    verbose: true,
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {}]
    },
    testMatch: ['**/tests/**/*.spec.ts']
}
