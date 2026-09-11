import { describe, expect, it } from 'vitest';
import { firstName, formatDate, formatTime, initials } from './format';

describe('format helpers', () => {
  it('formats clinic dates consistently', () => {
    expect(formatDate('2026-09-18')).toBe('September 18, 2026');
  });

  it('formats 24-hour times for patients', () => {
    expect(formatTime('14:30')).toBe('2:30 PM');
    expect(formatTime('09:00')).toBe('9:00 AM');
  });

  it('creates readable patient names and initials', () => {
    expect(firstName('Alex Morgan')).toBe('Alex');
    expect(initials('Alex Jamie Morgan')).toBe('AJ');
  });
});
