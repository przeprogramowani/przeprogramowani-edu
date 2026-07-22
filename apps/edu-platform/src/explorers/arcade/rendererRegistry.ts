import type { ArcadeGameType, ArcadeGameRenderer } from '../systems/ArcadeTypes';
import { AsteroidRangeRenderer } from './AsteroidRangeRenderer';
import { MemoryMatrixRenderer } from './MemoryMatrixRenderer';
import { OscilloscopeRenderer } from './OscilloscopeRenderer';
import { DeepScanRenderer } from './DeepScanRenderer';
import { SwitchyardRenderer } from './SwitchyardRenderer';
import { FaultTraceRenderer } from './FaultTraceRenderer';
import { CartographRenderer } from './CartographRenderer';

const RENDERERS = new Map<ArcadeGameType, new () => ArcadeGameRenderer>([
  ['asteroid-range', AsteroidRangeRenderer],
  ['memory-matrix', MemoryMatrixRenderer],
  ['oscilloscope', OscilloscopeRenderer],
  ['deep-scan', DeepScanRenderer],
  ['switchyard', SwitchyardRenderer],
  ['fault-trace', FaultTraceRenderer],
  ['cartograph', CartographRenderer],
]);

export function createRenderer(type: ArcadeGameType): ArcadeGameRenderer {
  const Ctor = RENDERERS.get(type);
  if (!Ctor) throw new Error(`Unknown or unregistered arcade game type: ${type}`);
  return new Ctor();
}
