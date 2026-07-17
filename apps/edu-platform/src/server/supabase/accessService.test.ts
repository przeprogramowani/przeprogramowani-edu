import { describe, expect, it } from 'vitest';
import { grantsToAirtableCourses } from './accessService';

describe('grantsToAirtableCourses', () => {
  it('maps 10xdevs-3 grants to the shared 10XDEVS_3 permission', () => {
    expect(grantsToAirtableCourses(['10xdevs-3'])).toEqual(['10XDEVS_3']);
    expect(grantsToAirtableCourses(['10xdevs-3-prework'])).toEqual(['10XDEVS_3']);
  });

  it('deduplicates the shared 10XDEVS_3 permission across both slugs', () => {
    expect(grantsToAirtableCourses(['10xdevs-3', '10xdevs-3-prework'])).toEqual(['10XDEVS_3']);
  });
});
