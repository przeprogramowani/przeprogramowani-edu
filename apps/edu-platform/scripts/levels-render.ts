/**
 * Render a compiled map to a PNG so humans and AI agents can eyeball a
 * level without launching the game.
 *
 * Usage:
 *   npm run levels:render -- <map-key>            # → OS temp dir
 *   npm run levels:render -- <map-key> --out path/to/file.png
 *   npm run levels:render -- <map-key> --zones    # overlay zone rectangles + object ids
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { PNG } from 'pngjs';
import { TILE_SIZE } from '../src/explorers/config/constants';
import { TILESET_COLS } from '../src/explorers/config/tileIndices';
import { ZONE_COLORS } from '../src/explorers/editor/types';
import type { TiledMap, TileLayer, ZoneObject } from '../src/explorers/editor/types';
import { MAPS_DIR } from './levels-common';

const TILESET_PATH = join(process.cwd(), 'public/game/tilesets/placeholder.png');

/** 3x5 digit glyphs for zone object-id labels, rows top→bottom, bit 2 = left pixel. */
const DIGITS: Record<string, number[]> = {
  '0': [0b111, 0b101, 0b101, 0b101, 0b111],
  '1': [0b010, 0b110, 0b010, 0b010, 0b111],
  '2': [0b111, 0b001, 0b111, 0b100, 0b111],
  '3': [0b111, 0b001, 0b111, 0b001, 0b111],
  '4': [0b101, 0b101, 0b111, 0b001, 0b001],
  '5': [0b111, 0b100, 0b111, 0b001, 0b111],
  '6': [0b111, 0b100, 0b111, 0b101, 0b111],
  '7': [0b111, 0b001, 0b010, 0b010, 0b010],
  '8': [0b111, 0b101, 0b111, 0b101, 0b111],
  '9': [0b111, 0b101, 0b111, 0b001, 0b111],
};

function blitTile(target: PNG, tileset: PNG, tileIndex: number, destX: number, destY: number): void {
  const srcX = ((tileIndex - 1) % TILESET_COLS) * TILE_SIZE;
  const srcY = Math.floor((tileIndex - 1) / TILESET_COLS) * TILE_SIZE;
  for (let y = 0; y < TILE_SIZE; y++) {
    for (let x = 0; x < TILE_SIZE; x++) {
      const src = ((srcY + y) * tileset.width + srcX + x) * 4;
      const dst = ((destY + y) * target.width + destX + x) * 4;
      const alpha = tileset.data[src + 3] / 255;
      if (alpha === 0) continue;
      // Source-over blend so transparent tile pixels keep lower layers.
      for (let channel = 0; channel < 3; channel++) {
        target.data[dst + channel] = Math.round(
          tileset.data[src + channel] * alpha + target.data[dst + channel] * (1 - alpha),
        );
      }
      target.data[dst + 3] = 255;
    }
  }
}

function blendPixel(target: PNG, x: number, y: number, rgb: [number, number, number], alpha: number): void {
  if (x < 0 || y < 0 || x >= target.width || y >= target.height) return;
  const dst = (y * target.width + x) * 4;
  for (let channel = 0; channel < 3; channel++) {
    target.data[dst + channel] = Math.round(rgb[channel] * alpha + target.data[dst + channel] * (1 - alpha));
  }
  target.data[dst + 3] = 255;
}

function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

function drawZone(target: PNG, zone: ZoneObject): void {
  const rgb = hexToRgb(ZONE_COLORS[zone.type] ?? '#ffffff');
  for (let y = zone.y; y < zone.y + zone.height; y++) {
    for (let x = zone.x; x < zone.x + zone.width; x++) {
      const onBorder =
        x < zone.x + 2 || x >= zone.x + zone.width - 2 || y < zone.y + 2 || y >= zone.y + zone.height - 2;
      blendPixel(target, x, y, rgb, onBorder ? 0.95 : 0.3);
    }
  }
  // Object id label (scaled 3x5 digits); the stdout legend maps ids to zone keys.
  const label = String(zone.id);
  const scale = 4;
  let penX = zone.x + 6;
  for (const char of label) {
    const glyph = DIGITS[char];
    if (!glyph) continue;
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 3; col++) {
        if (!(glyph[row] & (0b100 >> col))) continue;
        for (let sy = 0; sy < scale; sy++) {
          for (let sx = 0; sx < scale; sx++) {
            blendPixel(target, penX + col * scale + sx, zone.y + 6 + row * scale + sy, [255, 255, 255], 1);
          }
        }
      }
    }
    penX += 4 * scale;
  }
}

function main(): void {
  const args = process.argv.slice(2);
  const mapKey = args.find((arg) => !arg.startsWith('--'));
  const withZones = args.includes('--zones');
  const outIndex = args.indexOf('--out');
  if (!mapKey) {
    console.error('Usage: levels-render <map-key> [--zones] [--out <path>]');
    process.exit(1);
  }
  const jsonPath = join(MAPS_DIR, `${mapKey}.json`);
  if (!existsSync(jsonPath)) {
    console.error(`No compiled map at public/game/maps/${mapKey}.json — run npm run levels:build first.`);
    process.exit(1);
  }

  const map = JSON.parse(readFileSync(jsonPath, 'utf-8')) as TiledMap;
  const tileset = PNG.sync.read(readFileSync(TILESET_PATH));
  const image = new PNG({ width: map.width * TILE_SIZE, height: map.height * TILE_SIZE, fill: true });

  for (const layerName of ['Ground', 'Walls', 'Above']) {
    const layer = map.layers.find((entry) => entry.type === 'tilelayer' && entry.name === layerName) as
      | TileLayer
      | undefined;
    if (!layer) continue;
    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        const tile = layer.data[y * map.width + x];
        if (tile > 0) {
          blitTile(image, tileset, tile, x * TILE_SIZE, y * TILE_SIZE);
        }
      }
    }
  }

  if (withZones) {
    const zonesLayer = map.layers.find((entry) => entry.type === 'objectgroup' && entry.name === 'Zones');
    const zones = zonesLayer && 'objects' in zonesLayer ? zonesLayer.objects : [];
    console.log('Zone legend:');
    for (const zone of zones) {
      drawZone(image, zone);
      const idProp = (zone.properties ?? []).find((prop) => prop.name === 'id');
      console.log(
        `  #${zone.id} ${zone.type} "${String(idProp?.value ?? zone.name)}" at tile (${zone.x / TILE_SIZE}, ${zone.y / TILE_SIZE})`,
      );
    }
  }

  const outPath = outIndex === -1 ? join(tmpdir(), `${mapKey}.png`) : args[outIndex + 1];
  writeFileSync(outPath, PNG.sync.write(image));
  console.log(`Rendered ${mapKey} → ${outPath}`);
}

main();
