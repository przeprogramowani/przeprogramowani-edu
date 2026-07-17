import { describe, expect, it } from 'vitest';
import { Platform } from '@edu/circle';
import { getExternalAuthConfig, getSpaceIdsForExternalAuth } from './externalAuthConfig';

describe('externalAuthConfig', () => {
  it('preserves the exact opanuj-frontend config values', () => {
    expect(getExternalAuthConfig('opanuj-frontend')).toEqual({
      courseId: 'opanuj-frontend',
      displayName: 'Opanuj Frontend',
      platform: Platform.CIRCLE_PRZEPROGRAMOWANI,
      communityId: 109682,
      spaceId: 944958,
      sectionIds: [
        171690, 179634, 273910, 179636, 273909, 179637, 273908, 179638, 273906, 179639, 273905,
      ],
    });
  });

  it('preserves the exact 10xdevs-1 config values', () => {
    expect(getExternalAuthConfig('10xdevs-1')).toEqual({
      courseId: '10xdevs-1',
      displayName: '10xDevs 1.0',
      platform: Platform.CIRCLE_BRAVE,
      communityId: 1272,
      spaceId: 1905722,
      sectionIds: [523702, 523703, 523705, 523706, 523707],
    });
  });

  it('preserves the exact 10xdevs-2 config values', () => {
    expect(getExternalAuthConfig('10xdevs-2')).toEqual({
      courseId: '10xdevs-2',
      displayName: '10xDevs 2.0',
      platform: Platform.CIRCLE_BRAVE,
      communityId: 1272,
      spaceId: 2166705,
      sectionIds: [681279, 681379, 681280, 681281, 681282, 681283],
      brandColor: '#2663EB',
    });
  });

  it('preserves the exact 10xdevs-3 config values', () => {
    expect(getExternalAuthConfig('10xdevs-3')).toEqual({
      courseId: '10xdevs-3',
      displayName: '10xDevs 3.0',
      platform: Platform.CIRCLE_BRAVE,
      communityId: 1272,
      spaceId: 2552674,
      sectionIds: [966234, 966235, 966236, 966240, 966241],
      brandColor: '#652B90',
    });
  });

  it('maps 10xdevs-3-prework to the 10xDevs 3 access space', () => {
    expect(getExternalAuthConfig('10xdevs-3-prework')).toEqual({
      courseId: '10xdevs-3-prework',
      displayName: '10xDevs 3.0: Prework',
      platform: Platform.CIRCLE_BRAVE,
      communityId: 1272,
      spaceId: 2552674,
      sectionIds: [966234, 966235, 966236, 966240, 966241],
      brandColor: '#652B90',
    });
  });

  it('preserves the exact configured space ids for membership refresh targets', () => {
    expect(getSpaceIdsForExternalAuth()).toEqual([944958, 1905722, 2166705, 2552674]);
  });
});
