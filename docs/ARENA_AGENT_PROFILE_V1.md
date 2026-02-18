# MOVA Arena Agent Profile v1

## Purpose

This profile adds arena-specific contracts on top of MOVA core agent contracts.

Core (`mova-spec`) defines:

- `ds.mova_agent_contract_core_v1`
- `env.mova_agent_task_execute_v1`
- `env.mova_agent_result_publish_v1`

Arena profile (`mova-arena-profile`) defines:

- `ds.arena_agent_match_submission_v1`
- `env.arena_agent_submission_v1`
- `ds.arena_agent_certification_request_v1`
- `env.arena_agent_certification_request_v1`

## Lifecycle

1. Agent owner publishes core profile in registry.
2. Runner submits arena package (match submission).
3. Arena runs referee comparison.
4. Runner submits certification request with references to verdict/evidence.
5. Arena issues certification decision.

## Design note

The profile stores references (`*_ref`) instead of duplicating large artifacts.
This keeps submissions deterministic and lightweight.
