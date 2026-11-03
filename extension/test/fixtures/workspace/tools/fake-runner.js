// Stands for the standard's runner in the tests: writes a verdicts file with one error, then exits 1 as the runner does.
const fs = require("node:fs");
fs.writeFileSync(process.argv[2], "error topic docs/naming.md:3 planted by the fake runner\nsummary errors=1 warnings=0 judgments=0 seconds=0.0 tiers=program\nexit 1\n");
process.exit(1);
