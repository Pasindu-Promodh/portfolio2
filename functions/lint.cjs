// ESLint 8 would otherwise pick up the frontend's flat config in the parent folder.
process.env.ESLINT_USE_FLAT_CONFIG = "false";
process.argv.push("--ext", ".js,.ts", "src");
require(require("node:path").join(__dirname, "node_modules/eslint/bin/eslint.js"));
