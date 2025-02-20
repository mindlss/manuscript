import globals from 'globals';
import pluginJs from '@eslint/js';

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        files: ['**/*.js'],
        languageOptions: {
            sourceType: 'commonjs',
            globals: {
                ...globals.node, // Подключаем глобальные переменные Node.js
            },
        },
    },
    pluginJs.configs.recommended, // Используем рекомендованные правила ESLint
];
