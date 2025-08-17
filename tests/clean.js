import * as fs from "node:fs";

fs.rmSync("./dist", {recursive: true, force: true});
fs.rmSync("./types", {recursive: true, force: true});
fs.rmSync("./index.min.js", {recursive: true, force: true});
