# MOVA Arena Profile

Domain extension for MOVA that standardizes observability records used by MOV Arena:

- contact execute step (`ds.mova_contact_step_core_v1`)
- compact capture step (`ds.mova_compact_capture_step_core_v1`)
- unified arena comparison row (`ds.mova_observability_step_core_v1`)

This repository is intentionally separate from `mova-spec` core.

## Why separate

- `mova-spec` remains universal and stable.
- Arena contracts can evolve faster without changing core.
- Users can adopt arena profile only if they need benchmarking/certification flows.

## Files

- `schemas/` profile schemas
- `examples/` valid payload examples
- `docs/mova_4.1.1_compact_contact_alignment.md` field mapping and normalization contract

## Validate

```bash
npm install
npm test
```

Validate one file:

```bash
npx mova-arena-validate --schema https://mova.dev/schemas/ds.mova_observability_step_core_v1.schema.json --file examples/ds.mova_observability_step_core_v1.example.json
```
