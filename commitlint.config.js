module.exports = {
    extends: ['@commitlint/cli', '@commitlint/config-conventional'],
    rules: {
        'type-enum': [2, 'always', ['feat', 'setup', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert']],
        'subject-case': [2, 'always', 'sentence-case']
    }
}
