# 10x Explorers — Sprite & Art Asset Generation Prompts

Prompts for multimodal image generation models (GPT-4o, Midjourney, DALL-E) to produce Phaser-compatible sprite sheets and tilesets for 10x Explorers.

## Style Reference

Use as prefix for every prompt below:

```
STYLE PREFIX:

Pixel art, 16-bit retro style, top-down RPG perspective (3/4 view like Pokemon or Stardew Valley). Clean readable sprites with limited color palette. Dark space-themed palette: deep navy (#0a0e2a), cosmic purple (#2d1b69), teal accents (#00d4aa), warm amber for lights (#ffb347), white for highlights. Transparent background (PNG). Sharp pixels, no anti-aliasing, no blur. Every sprite must align to a grid for Phaser tilemap compatibility.
```

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Deep Navy | `#0a0e2a` | Base background, dark surfaces |
| Cosmic Purple | `#2d1b69` | Shadows, nebula, accents |
| Teal | `#00d4aa` | Glowing elements, visor, interactive highlights |
| Warm Amber | `#ffb347` | Lights, warnings, warm accents |
| White | `#ffffff` | Stars, text highlights, shine |

---

## 1. Astronaut Character — Sprite Sheet

```
[STYLE PREFIX]

Create a top-down pixel-art character sprite sheet for a space explorer / astronaut on a fully transparent background (no solid color behind the character, PNG alpha).
Character: compact astronaut in a lightweight space suit with a glowing teal visor (#00d4aa) and a small backpack. Dark navy suit body (#0a0e2a) with teal trim. Visible boots and limbs for walk-cycle readability at 32px scale.

Tile size: exactly 32×48 pixels per frame. The character must be centered within each 32×48 cell, with feet near the bottom edge and head near the top. No frame borders, no guidelines — just the character pixels on transparency.

Layout: a single sprite sheet PNG containing a 4-column × 4-row grid (16 frames total).
Total sheet size: exactly 128 × 192 pixels.

Row-by-row breakdown (each row = one facing direction, each column = one walk-cycle frame):

- Row 1 (Y 0–47): facing DOWN (toward camera)
  - Col 1: idle stance, feet together
  - Col 2: left foot forward, right foot back
  - Col 3: idle stance, feet together (same as col 1)
  - Col 4: right foot forward, left foot back

- Row 2 (Y 48–95): facing LEFT
  - Col 1: idle stance
  - Col 2: stride forward (leading foot extended left)
  - Col 3: idle stance
  - Col 4: stride forward (opposite foot extended left)

- Row 3 (Y 96–143): facing RIGHT (mirror of Row 2)
  - Col 1: idle stance
  - Col 2: stride forward (leading foot extended right)
  - Col 3: idle stance
  - Col 4: stride forward (opposite foot extended right)

- Row 4 (Y 144–191): facing UP (away from camera, backpack visible)
  - Col 1: idle stance, feet together
  - Col 2: left foot forward, right foot back
  - Col 3: idle stance, feet together
  - Col 4: right foot forward, left foot back

Important constraints:
- The walk cycle must read clearly at 1× zoom (32px wide): use contrasting boot color and visible leg separation between frames.
- All 4 idle frames (col 1 and col 3 of each row) should be identical per row.
- Right-facing row should be a horizontal mirror of the left-facing row.
- Consistent proportions across all 16 frames — head size, body width, and foot placement must not drift between frames.
- No extra padding, no background fill — only character pixels on a transparent canvas.
```

## 2. Ship Interior — Tileset

```
[STYLE PREFIX]

Create a top-down pixel-art tileset for a spaceship interior. Tile size: 32x32 pixels.
Arrange tiles in a grid on a single PNG sheet (8 columns wide).

Include these tiles:
- Metal floor panels (3 variants: clean, scratched, grated)
- Corridor walls (horizontal, vertical, corners: TL, TR, BL, BR, T-junctions, crossings)
- Sliding door (closed, open — 2 frames)
- Window / viewport showing stars (2 variants)
- Hibernation pod (2x1 tiles, closed and open state)
- Control panel / dashboard (2x1 tiles, with blinking lights)
- Holographic display / screen (1x2 tiles, vertical, glowing teal)
- Cargo crate (1x1, stackable look)
- Ventilation grate
- Emergency lighting strip (floor-level, amber glow)
- Wiring / cables on floor (horizontal, vertical, corner)
- Ladder hatch (1x1)

All tiles must seamlessly connect when placed adjacent. Consistent shading — light source from top-left.
```

## 3. Space & Exterior — Background and Parallax Layers

```
[STYLE PREFIX]

Create a set of pixel-art space backgrounds for parallax scrolling in a 2D top-down game.
Canvas size: 512x512 pixels per layer, seamlessly tileable in all directions.

Layer 1 (farthest — slow scroll): Deep space — dark navy/black with distant tiny stars (white and pale blue dots, varying brightness). Subtle nebula wisps in purple and teal. Very sparse.

Layer 2 (middle — medium scroll): Star field — denser star pattern, some stars slightly larger. A faint spiral galaxy or distant planet silhouette in one corner. Dust lane streaks.

Layer 3 (nearest — fast scroll): Asteroid debris — small floating rocks, space dust particles, occasional glinting metal fragment. These are sparse sprites, not a filled background.

Each layer must be a separate PNG with transparent areas where no content exists (except Layer 1 which is fully filled as the base). All three layers composited together should create a rich, deep space environment.
```

## 4. Ship Interior Objects — Sprite Atlas

```
[STYLE PREFIX]

Create a pixel-art sprite atlas of spaceship interior objects, top-down 3/4 perspective view. Each object on transparent background, arranged in a grid. Tile reference size: 32x32 pixels (objects can span multiple tiles).

Objects to include:

Furniture & Workstations:
- Desk with computer terminal (2x1 tiles) — glowing screen, keyboard, mug
- Bookshelf / data rack (1x2 tiles, vertical) — filled with glowing data cartridges
- Workbench with tools (2x1 tiles) — soldering iron, parts, blueprints
- Chair (1x1) — two variants: office swivel, cockpit seat
- Bed / bunk (2x1 tiles) — with rumpled space blanket

Technology:
- Standing terminal / kiosk (1x1) — tall screen with teal glow, keyboard
- Holographic projector (1x1) — base unit with a floating hologram above it
- Server rack (1x2 tiles, vertical) — blinking LEDs, cables
- Antenna / comm relay (1x1) — small satellite dish on a base
- Robot assistant NPC (1x1) — small wheeled bot with a screen face

Ship Elements:
- Bulletin board / whiteboard (2x1 tiles) — covered in pinned notes and diagrams (the "Archive" object)
- Locker (1x1) — closed, with name tag
- Oxygen tank (1x1)
- Fire extinguisher (1x1)
- Plant in a pot (1x1) — small green plant, life on the ship
- Crate / container (1x1) — two variants: sealed, open with glowing contents

Interactive Markers:
- Exclamation mark floating icon (1x1, 16x16 centered) — quest available
- Question mark floating icon (1x1, 16x16 centered) — NPC dialogue
- Glowing orb / data fragment pickup (1x1, 16x16 centered) — collectible

Pack everything into a single atlas PNG. Include a 1px gap between sprites for clean slicing.
```

## 5. NPC Characters — Sprite Sheet

```
[STYLE PREFIX]

Create a pixel-art NPC sprite sheet for a spaceship crew. Top-down 3/4 view.
Frame size: 32x48 pixels (same as player character).
Each NPC needs: 1 idle-down frame + 1 idle-side frame (2 frames per character).

NPCs to include (6 characters, 2 frames each = 12 frames, arranged 2 cols × 6 rows):

1. Ship Captain — formal uniform, cap, confident pose, gray-haired
2. Engineer — overalls, wrench in hand, grease stains, goggles on forehead
3. Scientist — lab coat, tablet in hand, glasses, curious expression
4. Comms Officer — headset, glowing holographic wrist display, alert posture
5. Medic — white suit with red cross, gentle expression, carrying scanner
6. Mysterious Figure — hooded cloak, face obscured by shadow, subtle teal glow underneath

Each NPC should be visually distinct at 32px scale — silhouette readability is key.
Output as a single sprite sheet PNG, transparent background.
Total sheet size: 64 × 288 pixels.
```
