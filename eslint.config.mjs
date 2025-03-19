import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginTypescript from '@typescript-eslint/eslint-plugin';

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.js'],
        languageOptions: {
            sourceType: 'module',
            globals: {
                ...globals.node,
            },
        },
        plugins: {
            '@typescript-eslint': pluginTypescript,
        },
        rules: {
            '@typescript-eslint/no-unused-vars': ['error'],
            '@typescript-eslint/explicit-module-boundary-types': 'off',
        },
    },
    pluginJs.configs.recommended,
];
