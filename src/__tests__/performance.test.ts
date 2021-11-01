import { formatDate, throttle } from '../utils/performance';

describe('formatDate', () => {
  it('formats a date string', () => {
    const result = formatDate('2021-06-15');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('caches repeated calls', () => {
    const first = formatDate('2021-01-01');
    const second = formatDate('2021-01-01');
    expect(first).toBe(second);
  });

  it('handles multiple different dates', () => {
    const d1 = formatDate('2021-01-01');
    const d2 = formatDate('2021-12-31');
    expect(d1).not.toBe(d2);
  });
});

describe('throttle', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('calls function immediately', () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 200);
    throttled();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('does not call function again within limit', () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 200);
    throttled();
    throttled();
    throttled();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('allows calls after limit expires', () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 200);
    throttled();

    // Advance time past the throttle limit
    jest.advanceTimersByTime(250);
    throttled();
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
