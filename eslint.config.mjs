import eslint from "@eslint/js"
import tseslint from "typescript-eslint"

const TS = ["src/**/*.ts"]

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.strictTypeChecked.map(c => ({ ...c, files: TS })),
    ...tseslint.configs.stylisticTypeChecked.map(c => ({ ...c, files: TS })),
    {
        files: TS,
        languageOptions: {
            parserOptions: {
                projectService: true,
            },
        },
        rules: {
            "@typescript-eslint/no-unused-vars": [
                "error",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
            ],
            "@typescript-eslint/no-non-null-assertion": "error",
            "@typescript-eslint/no-explicit-any": "error",
            "@typescript-eslint/no-unsafe-assignment": "error",
            "@typescript-eslint/no-unsafe-call": "error",
            "@typescript-eslint/no-unsafe-member-access": "error",
            "@typescript-eslint/no-unsafe-return": "error",
            "@typescript-eslint/no-restricted-types": [
                "error",
                {
                    types: {
                        undefined: {
                            message:
                                "Do not use `undefined` as a type. Assert nullability at the boundary instead.",
                        },
                    },
                },
            ],
        },
    },
    {
        files: ["build.mjs"],
        languageOptions: {
            sourceType: "module",
            globals: {
                process: "readonly",
                console: "readonly",
            },
        },
    },
    {
        ignores: ["out/", "node_modules/", "src/*.js"],
    },
)
