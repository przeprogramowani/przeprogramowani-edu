export interface QaMapSpawn {
  /** Tile coordinates used by the in-game QA map selector. */
  x: number;
  y: number;
}

/** Safe authored-floor entry points for every map exposed by the QA selector. */
export const QA_MAP_SPAWNS: Readonly<Record<string, QaMapSpawn>> = {
  'm0-awakening': { x: 4, y: 4 },
  'm0-crew-room': { x: 2, y: 5 },
  'm0-exam-room': { x: 5, y: 5 },
  'm0-core-ai': { x: 2, y: 4 },
  'm1-landing-pad': { x: 2, y: 7 },
  'm1-echo-depths': { x: 2, y: 7 },
  'm1-shaft-control': { x: 2, y: 7 },
  'm1-profile-vault': { x: 2, y: 10 },
  'm1-uplink-bay': { x: 2, y: 11 },
  'm2-planning': { x: 2, y: 6 },
  'm2-staging-yard': { x: 2, y: 7 },
  'm2-drafting-hall': { x: 2, y: 7 },
  'm2-assembly-line': { x: 2, y: 3 },
  'm2-planning-core': { x: 2, y: 7 },
  'm3-apron': { x: 3, y: 7 },
  'm3-boneyard': { x: 2, y: 7 },
  'm3-fire-trial': { x: 2, y: 7 },
  'm3-annealing-yard': { x: 2, y: 7 },
  'm3-assay-office': { x: 2, y: 7 },
  'debug-npc-playground': { x: 1, y: 10 },
};
