#!/usr/bin/env node

import { execSync } from "child_process";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const WORKBENCH = join(__dirname, "..");
const EDU_PLATFORM = join(WORKBENCH, "..");
const CIRCLE_BACKUP = join(EDU_PLATFORM, "..", "..", "tools", "circle-lesson-backup");

const STEPS = [
  {
    name: "transport",
    cmd: "npm run transport",
    dryCmd: "npm run transport:dry",
    cwd: WORKBENCH,
    forwardTargets: (targets) => targets.join(" "),
  },
  {
    name: "generate:lesson-html",
    cmd: "npm run generate:lesson-html",
    dryCmd: "npm run generate:lesson-html:dry",
    cwd: EDU_PLATFORM,
    forwardTargets: (targets) => targets.map((t) => `--filter=${t}`).join(" "),
  },
  {
    name: "circle:prepare",
    cmd: "npm run circle:prepare",
    dryCmd: "npm run circle:prepare:dry",
    cwd: CIRCLE_BACKUP,
  },
  {
    name: "circle:push",
    cmd: "npm run push",
    dryCmd: "npm run push:dry",
    cwd: CIRCLE_BACKUP,
  },
];

const STEP_NAMES = STEPS.map((s) => s.name);

function parseArgs(argv) {
  const args = argv.slice(2);
  let dryRun = false;
  let from = null;
  let to = null;
  const targets = [];

  for (const arg of args) {
    if (arg === "--dry-run") {
      dryRun = true;
    } else if (arg.startsWith("--from=")) {
      from = arg.slice("--from=".length);
    } else if (arg.startsWith("--to=")) {
      to = arg.slice("--to=".length);
    } else if (!arg.startsWith("--")) {
      targets.push(arg);
    }
  }

  if (from && !STEP_NAMES.includes(from)) {
    console.error(`❌ Unknown step "${from}". Available: ${STEP_NAMES.join(", ")}`);
    process.exit(1);
  }
  if (to && !STEP_NAMES.includes(to)) {
    console.error(`❌ Unknown step "${to}". Available: ${STEP_NAMES.join(", ")}`);
    process.exit(1);
  }

  return { dryRun, from, to, targets };
}

function runStep(step, dryRun, targets) {
  let cmd = dryRun ? step.dryCmd : step.cmd;
  if (targets.length > 0 && step.forwardTargets) {
    cmd += ` -- ${step.forwardTargets(targets)}`;
  }
  const start = performance.now();

  try {
    execSync(cmd, { cwd: step.cwd, stdio: "inherit" });
    const elapsed = ((performance.now() - start) / 1000).toFixed(1);
    console.log(`✅ ${step.name} (${elapsed}s)\n`);
  } catch (err) {
    const elapsed = ((performance.now() - start) / 1000).toFixed(1);
    console.error(`❌ ${step.name} failed after ${elapsed}s`);
    process.exit(1);
  }
}

function main() {
  const { dryRun, from, to, targets } = parseArgs(process.argv);

  const fromIdx = from ? STEP_NAMES.indexOf(from) : 0;
  const toIdx = to ? STEP_NAMES.indexOf(to) : STEPS.length - 1;

  if (fromIdx > toIdx) {
    console.error(`❌ --from="${from}" comes after --to="${to}"`);
    process.exit(1);
  }

  const selected = STEPS.slice(fromIdx, toIdx + 1);

  const targetLabel = targets.length > 0 ? ` [${targets.join(", ")}]` : "";
  console.log(`\n🚀 10xDevs3 Pipeline${dryRun ? " (DRY RUN)" : ""}${targetLabel}`);
  console.log(`   Steps: ${selected.map((s) => s.name).join(" → ")}\n`);

  for (const step of selected) {
    console.log(`▶ ${step.name}${dryRun ? " [dry]" : ""}`);
    runStep(step, dryRun, targets);
  }

  console.log(`🎉 Pipeline complete. ${selected.length} step(s) executed.`);
}

main();
