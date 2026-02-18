#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Ajv2020 from "ajv/dist/2020.js";

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const key = argv[i];
    const val = argv[i + 1];
    if (key === "--schema") args.schema = val;
    if (key === "--file") args.file = val;
  }
  return args;
}

const { schema, file } = parseArgs(process.argv);
if (!schema || !file) {
  console.error("Usage: mova-arena-validate --schema <schema-id-or-path> --file <json-file>");
  process.exit(2);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const schemasDir = path.join(root, "schemas");
const ajv = new Ajv2020({ strict: false, allErrors: true, validateFormats: false });

for (const entry of fs.readdirSync(schemasDir).filter((x) => x.endsWith(".json"))) {
  const payload = JSON.parse(fs.readFileSync(path.join(schemasDir, entry), "utf8"));
  ajv.addSchema(payload);
}

let validate;
if (schema.startsWith("http://") || schema.startsWith("https://")) {
  validate = ajv.getSchema(schema);
} else if (schema.endsWith(".json")) {
  const schemaPath = path.isAbsolute(schema) ? schema : path.join(root, schema);
  validate = ajv.compile(JSON.parse(fs.readFileSync(schemaPath, "utf8")));
} else {
  validate = ajv.getSchema(schema);
}

if (!validate) {
  console.error(`Schema not found: ${schema}`);
  process.exit(2);
}

const filePath = path.isAbsolute(file) ? file : path.join(root, file);
const instance = JSON.parse(fs.readFileSync(filePath, "utf8"));
const ok = validate(instance);
if (ok) {
  console.log(`PASS ${file}`);
  process.exit(0);
}

console.log(`FAIL ${file}`);
for (const err of validate.errors || []) {
  const loc = err.instancePath || err.schemaPath || "";
  console.log(`  ${loc}: ${err.message}`);
}
process.exit(1);
