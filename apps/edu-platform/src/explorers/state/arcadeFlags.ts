import type { ArcadeStationFlag } from '../config/flags';
import type { ArcadeStationContext } from '../systems/ArcadeTypes';

export function getArcadeStationClearFlag<
  const MapKey extends string,
  const ZoneId extends string,
  const ArcadeGameId extends string,
>(context: ArcadeStationContext<MapKey, ZoneId, ArcadeGameId>): ArcadeStationFlag<MapKey, ZoneId, ArcadeGameId> {
  return `arcade:${context.mapKey}:${context.zoneId}:${context.arcadeGameId}`;
}
