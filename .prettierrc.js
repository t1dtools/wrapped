module.exports = {
    semi: false,
    useTabs: false,
    tabWidth: 4,
    singleQuote: true,
    trailingComma: 'es5',
    proseWrap: 'always',
    jsxBracketSameLine: true,
    bracketSpacing: true,
    arrowParens: 'avoid',
    printWidth: 120,
    overrides: [
        {
            files: '*.json',
            options: {
                singleQuote: false,
                tabWidth: 2,
            },
        },
    ],
}
