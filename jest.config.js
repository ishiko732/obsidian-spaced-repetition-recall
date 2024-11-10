/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    verbose: true,
    preset: "ts-jest",
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["jest-expect-message"],
    moduleNameMapper: {
        "src/(.*)": "<rootDir>/src/$1",
    },
    modulePaths: ["<rootDir>"],
    transform: {
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
            "<rootDir>/utils/fileTransformer.js",
    },
    moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node", "d.ts"],
    roots: ["<rootDir>/src/", "<rootDir>/tests/unit/"],
    collectCoverageFrom: [
        "src/**/lang/*.ts",
        "src/NoteEaseList.ts",
        "src/NoteFileLoader.ts",
        "src/NoteParser.ts",
        "src/NoteQuestionParser.ts",
        "src/TopicParser.ts",
        "src/parser.ts",
        "src/scheduling.ts",
        "utils.ts",
    ],
    coveragePathIgnorePatterns: [
        "/node_modules/",
        "src/lang/locale/",
        "src/constants",
        "src/icons",
        "src/declarations.d.ts",
        "build",
    ],
    coverageDirectory: "coverage",
    coverageReporters: ["text", "html"],
    collectCoverage: true,
    coverageProvider: "v8",
    coverageThreshold: {
        global: {
            statements: 100,
            branches: 100,
        },
    },
};
