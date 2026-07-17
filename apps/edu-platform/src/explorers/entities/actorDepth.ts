import { DEPTH } from '../config/constants';

export function actorDepth(y: number): number {
  return DEPTH.PLAYER + y / 1000;
}
