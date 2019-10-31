import resolve from "rollup-plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

module.exports = {
  input: "src/index.js",
  output: [
    {
      file: "dist/confic.js",
      format: "cjs"
    },
    {
      file: "dist/confic.esm.js",
      format: "esm"
    }
  ],
  plugins: [resolve(), terser()]
};
