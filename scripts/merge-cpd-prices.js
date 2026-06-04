#!/usr/bin/env node
// DEPRECATED — superseded by scripts/merge-retail-prices.js, which handles
// both Cost Plus Drugs and HealthWarehouse browser-phase outputs in one pass.
// This stub remains so the old scheduled-task prompt (if anyone has a copy)
// fails loudly instead of silently doing the wrong thing.
console.error('[error] scripts/merge-cpd-prices.js is deprecated.');
console.error('[error] Use scripts/merge-retail-prices.js instead — it merges CPD + HW.');
process.exit(1);
