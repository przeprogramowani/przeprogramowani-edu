import type { ArcadeGameType, ArcadeGameRenderer } from '../systems/ArcadeTypes';
import { AsteroidRangeRenderer } from './AsteroidRangeRenderer';
import { MemoryMatrixRenderer } from './MemoryMatrixRenderer';
import { OscilloscopeRenderer } from './OscilloscopeRenderer';

const RENDERERS = new Map<ArcadeGameType, new () => ArcadeGameRenderer>([
  ['asteroid-range', AsteroidRangeRenderer],
  ['memory-matrix', MemoryMatrixRenderer],
  ['oscilloscope', OscilloscopeRenderer],
]);

export function createRenderer(type: ArcadeGameType): ArcadeGameRenderer {
  const Ctor = RENDERERS.get(type);
  if (!Ctor) throw new Error(`Unknown or unregistered arcade game type: ${type}`);
  return new Ctor();
}
