module.exports = {
  root: true,
  env: {
    es6: true,
    jest: true,
    node: true
  },
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },

  extends: ["airbnb-base", "plugin:prettier/recommended"],
  rules: {
    "no-console": 0,
    "padding-line-between-statements": [
      "error",
      {
        blankLine: "never",
        prev: ["singleline-const", "singleline-let", "singleline-var"],
        next: ["singleline-const", "singleline-let", "singleline-var"]
      },
      {
        blankLine: "always",
        prev: [
          "class",
          "function",
          "multiline-const",
          "multiline-let",
          "multiline-var",
          "multiline-expression",
          "multiline-block-like"
        ],
        next: [
          "class",
          "function",
          "multiline-const",
          "multiline-let",
          "multiline-var",
          "multiline-expression",
          "multiline-block-like",
          "singleline-const",
          "singleline-let",
          "singleline-var"
        ]
      },
      {
        blankLine: "always",
        prev: [
          "class",
          "function",
          "multiline-const",
          "multiline-let",
          "multiline-var",
          "multiline-expression",
          "multiline-block-like",
          "singleline-const",
          "singleline-let",
          "singleline-var"
        ],
        next: [
          "class",
          "function",
          "multiline-const",
          "multiline-let",
          "multiline-var",
          "multiline-expression",
          "multiline-block-like"
        ]
      },
      {
        blankLine: "always",
        prev: "*",
        next: "cjs-export"
      },
      {
        blankLine: "always",
        prev: "cjs-import",
        next: "*"
      },
      {
        blankLine: "never",
        prev: "cjs-import",
        next: "cjs-import"
      },
      {
        blankLine: "always",
        prev: "*",
        next: "return"
      }
    ]
  },

  parserOptions: {
    parser: "babel-eslint"
  }
};
