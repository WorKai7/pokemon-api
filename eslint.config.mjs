import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
    { languageOptions: { globals: globals.node } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        rules: {
            '@typescript-eslint/no-unused-vars': 'off',
            'no-debugger': 'error',
            'no-console': 'error',
        },
    },
    {
        ignores: ['node_modules', 'build'],
    },
];
