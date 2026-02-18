#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const Ajv2020 = require("ajv/dist/2020");

const ajv = new Ajv2020({
  strict: false,
  allErrors: true,
  validateFormats: false
});

const SCHEMAS_DIR = path.join(__dirname, "..", "schemas");
const files = fs.readdirSync(SCHEMAS_DIR).filter((f) => f.endsWith(".json")).sort();

if (files.length === 0) {
  console.error("No schema files found in 'schemas/'.");
  process.exit(1);
}

console.log(`Found ${files.length} schema file(s).`);

const schemas = new Map();
for (const file of files) {
  const fullPath = path.join(SCHEMAS_DIR, file);
  const raw = fs.readFileSync(fullPath, "utf8");
  schemas.set(file, JSON.parse(raw));
}

for (const [file, schema] of schemas) {
  try {
    ajv.addSchema(schema);
  } catch (err) {
    console.error(`FAIL schemas\\${file}`);
    console.error(`  can't add schema: ${err.message}`);
    process.exit(1);
  }
}

let hasErrors = false;
console.log("Validating...");

for (const [file, schema] of schemas) {
  const valid = ajv.validateSchema(schema);
  if (valid) {
    console.log(`OK   schemas\\${file}`);
  } else {
    hasErrors = true;
    console.log(`FAIL schemas\\${file}`);
    for (const err of ajv.errors || []) {
      const loc = err.instancePath || err.schemaPath || "";
      console.log(`  ${loc}: ${err.message}`);
    }
  }
}

if (hasErrors) {
  console.log("\nSome schemas failed validation.");
  process.exit(1);
}

console.log("\nAll schemas validated successfully.");
