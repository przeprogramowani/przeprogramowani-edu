import { Platform } from './types';

// Token configuration per platform
export const TOKENS = {
  [Platform.CIRCLE_BRAVE]: 'R1wjqUunfmNxHSEXE6V8EXbuXMrTZrtv',
  [Platform.CIRCLE_PRZEPROGRAMOWANI]: 'syGrj5DabsfeWSP9qdtAVkZHVNrHuj1p',
};

export function getTokenForPlatform(platform: Platform): string {
  return TOKENS[platform];
}
