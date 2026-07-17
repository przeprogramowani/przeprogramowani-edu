// Generates deterministic placeholder PNG assets for 10x Explorers.
// Run: node scripts/generate-placeholder-assets.mjs
import { createCanvas } from '@napi-rs/canvas';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const PUBLIC = join(import.meta.dirname, '..', 'public', 'game');
// IMPORTANT: Must match TILE_SIZE in src/explorers/config/constants.ts
const TILE = 64;
const COLS = 8;
const ROWS = 4;

// Color palette
const FLOOR = '#1a1a2e';
const FLOOR_VARIANT = '#1e1e34';
const FLOOR_GRID = '#252545';
const FLOOR_GRID_V = '#2a2a48';
const WALL = '#4a4a6a';
const WALL_HI = '#6a6a8a';
const WALL_SH = '#3a3a5a';
const SPACE = '#0a0e2a';
const TEAL = '#00d4aa';
const AMBER = '#ffb347';
const PIPE_COLOR = '#3a3a5a';
const PIPE_HI = '#555580';

function ensureDir(filePath) {
  mkdirSync(dirname(filePath), { recursive: true });
}

// --- Floor drawing functions ---

function drawFloorClean(ctx, x, y) {
  ctx.fillStyle = FLOOR;
  ctx.fillRect(x, y, TILE, TILE);
  ctx.strokeStyle = FLOOR_GRID;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + 16, y);
  ctx.lineTo(x + 16, y + TILE);
  ctx.moveTo(x, y + 16);
  ctx.lineTo(x + TILE, y + 16);
  ctx.stroke();
}

function drawFloorVariant(ctx, x, y) {
  ctx.fillStyle = FLOOR_VARIANT;
  ctx.fillRect(x, y, TILE, TILE);
  ctx.strokeStyle = FLOOR_GRID_V;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + 8, y);
  ctx.lineTo(x + 8, y + TILE);
  ctx.moveTo(x + 24, y);
  ctx.lineTo(x + 24, y + TILE);
  ctx.moveTo(x, y + 8);
  ctx.lineTo(x + TILE, y + 8);
  ctx.moveTo(x, y + 24);
  ctx.lineTo(x + TILE, y + 24);
  ctx.stroke();
}

function drawFloorGrated(ctx, x, y) {
  ctx.fillStyle = FLOOR;
  ctx.fillRect(x, y, TILE, TILE);
  ctx.strokeStyle = FLOOR_GRID;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let dy = 4; dy < TILE; dy += 4) {
    ctx.moveTo(x, y + dy);
    ctx.lineTo(x + TILE, y + dy);
  }
  ctx.stroke();
}

function drawFloorAmber(ctx, x, y) {
  ctx.fillStyle = FLOOR;
  ctx.fillRect(x, y, TILE, TILE);
  // Subtle grid
  ctx.strokeStyle = FLOOR_GRID;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + 16, y);
  ctx.lineTo(x + 16, y + TILE);
  ctx.moveTo(x, y + 16);
  ctx.lineTo(x + TILE, y + 16);
  ctx.stroke();
  // Amber lighting strip on bottom edge
  ctx.fillStyle = AMBER;
  ctx.fillRect(x, y + TILE - 3, TILE, 3);
}

// --- Wall drawing functions ---

function drawWallEdge(ctx, x, y, highlightSides) {
  // Fill wall base
  ctx.fillStyle = WALL;
  ctx.fillRect(x, y, TILE, TILE);
  // Shadow on non-highlighted edges
  ctx.fillStyle = WALL_SH;
  if (!highlightSides.includes('N')) ctx.fillRect(x, y, TILE, 1);
  if (!highlightSides.includes('S')) ctx.fillRect(x, y + TILE - 1, TILE, 1);
  if (!highlightSides.includes('E')) ctx.fillRect(x + TILE - 1, y, 1, TILE);
  if (!highlightSides.includes('W')) ctx.fillRect(x, y, 1, TILE);
  // Highlight on room-facing edges
  ctx.fillStyle = WALL_HI;
  if (highlightSides.includes('N')) ctx.fillRect(x, y, TILE, 2);
  if (highlightSides.includes('S')) ctx.fillRect(x, y + TILE - 2, TILE, 2);
  if (highlightSides.includes('E')) ctx.fillRect(x + TILE - 2, y, 2, TILE);
  if (highlightSides.includes('W')) ctx.fillRect(x, y, 2, TILE);
}

function drawInnerCorner(ctx, x, y, openQuadrant) {
  // Wall fill with a floor-colored cutout in the specified quadrant
  ctx.fillStyle = WALL;
  ctx.fillRect(x, y, TILE, TILE);
  const half = TILE / 2;
  ctx.fillStyle = FLOOR;
  switch (openQuadrant) {
    case 'SE':
      ctx.fillRect(x + half, y + half, half, half);
      break;
    case 'SW':
      ctx.fillRect(x, y + half, half, half);
      break;
    case 'NE':
      ctx.fillRect(x + half, y, half, half);
      break;
    case 'NW':
      ctx.fillRect(x, y, half, half);
      break;
  }
  // Highlight on the inner edges of the cutout
  ctx.fillStyle = WALL_HI;
  switch (openQuadrant) {
    case 'SE':
      ctx.fillRect(x + half - 1, y + half, 2, half);
      ctx.fillRect(x + half, y + half - 1, half, 2);
      break;
    case 'SW':
      ctx.fillRect(x + half - 1, y + half, 2, half);
      ctx.fillRect(x, y + half - 1, half, 2);
      break;
    case 'NE':
      ctx.fillRect(x + half - 1, y, 2, half);
      ctx.fillRect(x + half, y + half - 1, half, 2);
      break;
    case 'NW':
      ctx.fillRect(x + half - 1, y, 2, half);
      ctx.fillRect(x, y + half - 1, half, 2);
      break;
  }
}

function drawWallSolid(ctx, x, y) {
  ctx.fillStyle = WALL;
  ctx.fillRect(x, y, TILE, TILE);
  ctx.strokeStyle = WALL_SH;
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, y + 0.5, TILE - 1, TILE - 1);
  // Subtle cross detail
  ctx.strokeStyle = WALL_SH;
  ctx.beginPath();
  ctx.moveTo(x + 8, y + 8);
  ctx.lineTo(x + TILE - 8, y + TILE - 8);
  ctx.moveTo(x + TILE - 8, y + 8);
  ctx.lineTo(x + 8, y + TILE - 8);
  ctx.stroke();
}

// --- Special tile drawing functions ---

function drawSpaceVoid(ctx, x, y) {
  ctx.fillStyle = SPACE;
  ctx.fillRect(x, y, TILE, TILE);
  // A few distant stars
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + 5, y + 12, 1, 1);
  ctx.fillRect(x + 20, y + 6, 1, 1);
  ctx.fillRect(x + 14, y + 22, 1, 1);
  ctx.fillStyle = '#888888';
  ctx.fillRect(x + 26, y + 18, 1, 1);
  ctx.fillRect(x + 8, y + 28, 1, 1);
}

function drawWindow(ctx, x, y) {
  // Wall fill with viewport to space
  ctx.fillStyle = WALL;
  ctx.fillRect(x, y, TILE, TILE);
  // Viewport cutout
  const vx = x + 6;
  const vy = y + 10;
  const vw = 20;
  const vh = 12;
  ctx.fillStyle = SPACE;
  ctx.fillRect(vx, vy, vw, vh);
  // Stars (fixed positions for determinism)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(vx + 3, vy + 3, 1, 1);
  ctx.fillRect(vx + 12, vy + 7, 1, 1);
  ctx.fillRect(vx + 8, vy + 2, 1, 1);
  ctx.fillRect(vx + 16, vy + 5, 1, 1);
  ctx.fillRect(vx + 5, vy + 9, 1, 1);
  // Viewport frame
  ctx.strokeStyle = WALL_HI;
  ctx.lineWidth = 1;
  ctx.strokeRect(vx - 0.5, vy - 0.5, vw + 1, vh + 1);
  // Highlight on bottom edge (window is on north wall, room is south)
  ctx.fillStyle = WALL_HI;
  ctx.fillRect(x, y + TILE - 2, TILE, 2);
}

function drawDoorTile(ctx, x, y) {
  // Floor base with teal door frame lines
  ctx.fillStyle = FLOOR;
  ctx.fillRect(x, y, TILE, TILE);
  // Teal frame on left and right edges
  ctx.fillStyle = TEAL;
  ctx.fillRect(x, y, 3, TILE);
  ctx.fillRect(x + TILE - 3, y, 3, TILE);
  // Subtle floor grid inside
  ctx.strokeStyle = FLOOR_GRID;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + 16, y);
  ctx.lineTo(x + 16, y + TILE);
  ctx.stroke();
}

function drawPipeHoriz(ctx, x, y) {
  // Transparent background — don't fill
  // Horizontal pipe through center
  const py = y + TILE / 2 - 2;
  ctx.fillStyle = PIPE_COLOR;
  ctx.fillRect(x, py, TILE, 4);
  // Highlight on top edge of pipe
  ctx.fillStyle = PIPE_HI;
  ctx.fillRect(x, py, TILE, 1);
}

function drawPipeVert(ctx, x, y) {
  // Transparent background — don't fill
  // Vertical pipe through center
  const px = x + TILE / 2 - 2;
  ctx.fillStyle = PIPE_COLOR;
  ctx.fillRect(px, y, 4, TILE);
  // Highlight on left edge of pipe
  ctx.fillStyle = PIPE_HI;
  ctx.fillRect(px, y, 1, TILE);
}

// --- Main tileset generator ---

function generateTileset() {
  const canvas = createCanvas(TILE * COLS, TILE * ROWS);
  const ctx = canvas.getContext('2d');

  // Clear to transparent
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const tx = (col) => col * TILE;
  const ty = (row) => row * TILE;

  // --- Row 0: Floor tiles (data indices 1-4) ---
  drawFloorClean(ctx, tx(0), ty(0));
  drawFloorVariant(ctx, tx(1), ty(0));
  drawFloorGrated(ctx, tx(2), ty(0));
  drawFloorAmber(ctx, tx(3), ty(0));
  // cols 4-7: reserved (transparent)

  // --- Row 1: Wall edges + outer corners (data indices 9-16) ---
  drawWallEdge(ctx, tx(0), ty(1), ['S']); // 9:  edge-S
  drawWallEdge(ctx, tx(1), ty(1), ['N']); // 10: edge-N
  drawWallEdge(ctx, tx(2), ty(1), ['E']); // 11: edge-E
  drawWallEdge(ctx, tx(3), ty(1), ['W']); // 12: edge-W
  drawWallEdge(ctx, tx(4), ty(1), ['S', 'E']); // 13: corner-SE
  drawWallEdge(ctx, tx(5), ty(1), ['S', 'W']); // 14: corner-SW
  drawWallEdge(ctx, tx(6), ty(1), ['N', 'E']); // 15: corner-NE
  drawWallEdge(ctx, tx(7), ty(1), ['N', 'W']); // 16: corner-NW

  // --- Row 2: Inner corners + T-junctions (data indices 17-24) ---
  drawInnerCorner(ctx, tx(0), ty(2), 'SE'); // 17: inner-SE
  drawInnerCorner(ctx, tx(1), ty(2), 'SW'); // 18: inner-SW
  drawInnerCorner(ctx, tx(2), ty(2), 'NE'); // 19: inner-NE
  drawInnerCorner(ctx, tx(3), ty(2), 'NW'); // 20: inner-NW
  drawWallEdge(ctx, tx(4), ty(2), ['N', 'E', 'W']); // 21: tee-N
  drawWallEdge(ctx, tx(5), ty(2), ['S', 'E', 'W']); // 22: tee-S
  drawWallEdge(ctx, tx(6), ty(2), ['N', 'E', 'S']); // 23: tee-E
  drawWallEdge(ctx, tx(7), ty(2), ['N', 'S', 'W']); // 24: tee-W

  // --- Row 3: Solid + Special (data indices 25-32) ---
  drawWallSolid(ctx, tx(0), ty(3)); // 25: wall-solid
  drawWallEdge(ctx, tx(1), ty(3), ['E', 'W']); // 26: wall-vert-pass
  drawWallEdge(ctx, tx(2), ty(3), ['N', 'S']); // 27: wall-horiz-pass
  drawSpaceVoid(ctx, tx(3), ty(3)); // 28: space-void
  drawWindow(ctx, tx(4), ty(3)); // 29: window
  drawDoorTile(ctx, tx(5), ty(3)); // 30: door-tile
  drawPipeHoriz(ctx, tx(6), ty(3)); // 31: pipe-horiz
  drawPipeVert(ctx, tx(7), ty(3)); // 32: pipe-vert

  const outPath = join(PUBLIC, 'tilesets', 'placeholder.png');
  ensureDir(outPath);
  writeFileSync(outPath, canvas.toBuffer('image/png'));
  console.log(`✓ ${outPath} (${COLS}x${ROWS} tiles = ${COLS * ROWS} total)`);
}

function generateAstronaut() {
  const W = 64;
  const H = 96;
  const SPRITE_COLS = 4; // frames per direction
  const SPRITE_ROWS = 4; // directions: down, left, right, up
  const canvas = createCanvas(W * SPRITE_COLS, H * SPRITE_ROWS);
  const ctx = canvas.getContext('2d');

  // Direction arrows (one per row)
  const arrows = [
    // down ▼
    (cx, cy) => {
      ctx.moveTo(cx - 4, cy - 3);
      ctx.lineTo(cx + 4, cy - 3);
      ctx.lineTo(cx, cy + 4);
    },
    // left ◀
    (cx, cy) => {
      ctx.moveTo(cx + 3, cy - 4);
      ctx.lineTo(cx + 3, cy + 4);
      ctx.lineTo(cx - 4, cy);
    },
    // right ▶
    (cx, cy) => {
      ctx.moveTo(cx - 3, cy - 4);
      ctx.lineTo(cx - 3, cy + 4);
      ctx.lineTo(cx + 4, cy);
    },
    // up ▲
    (cx, cy) => {
      ctx.moveTo(cx - 4, cy + 3);
      ctx.lineTo(cx + 4, cy + 3);
      ctx.lineTo(cx, cy - 4);
    },
  ];

  // Leg patterns per column: [leftFootOffsetY, rightFootOffsetY]
  // 0 = neutral, negative = foot forward (down), positive = foot back (up)
  const legPatterns = [
    [0, 0], // col 0: idle — both feet neutral
    [-3, 3], // col 1: step-left — left foot forward, right back
    [0, 0], // col 2: idle — both feet neutral
    [3, -3], // col 3: step-right — right foot forward, left back
  ];

  for (let row = 0; row < SPRITE_ROWS; row++) {
    for (let col = 0; col < SPRITE_COLS; col++) {
      const x = col * W;
      const y = row * H;

      // Body — teal rectangle
      ctx.fillStyle = '#00d4aa';
      ctx.fillRect(x + 4, y + 4, 24, 34);

      // Arrow — white directional indicator
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      arrows[row](x + W / 2, y + 14);
      ctx.closePath();
      ctx.fill();

      // Legs — small rectangles at bottom
      const [leftOff, rightOff] = legPatterns[col];
      const legY = y + 38;
      const legW = 6;
      const legH = 8;

      // Left leg
      ctx.fillStyle = '#009977';
      ctx.fillRect(x + 7, legY + leftOff, legW, legH);

      // Right leg
      ctx.fillStyle = '#009977';
      ctx.fillRect(x + 19, legY + rightOff, legW, legH);
    }
  }

  const outPath = join(PUBLIC, 'sprites', 'placeholder-astronaut.png');
  ensureDir(outPath);
  writeFileSync(outPath, canvas.toBuffer('image/png'));
  console.log(
    `✓ ${outPath} (${SPRITE_COLS}x${SPRITE_ROWS} = ${SPRITE_COLS * SPRITE_ROWS} frames)`,
  );
}

generateTileset();
generateAstronaut();
console.log('All placeholder assets generated.');
