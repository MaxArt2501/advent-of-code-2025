const ranges = input.trim().split(',').map(interval => interval.split('-'));
/**
 * @param {number} repeats Should be 2 for the first part
 * @param {string} start Range start as string
 * @param {string} end Range end as string
 */
const getInvalidIds = (repeats, start, end) => {
  // If the length of the start number is divisible by `repeats`, we start the sequence
  // from the first characters of the start number; otherwise, we start from the next
  // power of 10. E.g.: `repeats` is 2, `start` is 456, so `seqStart` would be 10; if
  // `start` is 45, then `seqStart` would be '4'.
  const seqStart = start.length % repeats ? 10 ** (Math.ceil(start.length / repeats) - 1) : start.slice(0, start.length / repeats);
  // If the length of the end number is divisible by `repeats`, we end the sequence
  // from the first characters of the end number; otherwise, we end from the previous
  // power of 10 minus 1. E.g.: `repeats` is 2, `end` is 45678, so `seqEnd` would be 99;
  // if `end` is 4567, then `seqEnd` would be '45'.
  const seqEnd = end.length % repeats ? 10 ** Math.floor(end.length / repeats) - 1 : end.slice(0, end.length / repeats);
  // If `start` is '4567`, then we'd start from `4545`, which is *not* included in the
  // range. Therefore we'll actually start from '4646'.
  const includeStart = Number(String(seqStart).repeat(repeats)) >= Number(start);
  // Similar argument here...
  const includeEnd = Number(String(seqEnd).repeat(repeats)) <= Number(end);
  // Yes, I know, it's implicit conversion from boolean to number. Sue me.
  const base = Number(seqStart) + 1 - includeStart;
  return Array.from(
    { length: seqEnd - seqStart - 1 + includeStart + includeEnd },
    (_, count) => Number(String(base + count).repeat(repeats))
  );
};

console.log(ranges.flatMap(range => getInvalidIds(2, ...range)).reduce((sum, id) => sum + id));

console.log(ranges.flatMap(([start, end]) => {
  // We look for repetitions from 2 to the length of the range end
  const allInvalidIds = Array.from(
    { length: end.length - 1 },
    (_, index) => getInvalidIds(index + 2, start, end)
  ).flat();
  // Some ID's could be repeated, e.g. '1111' could be '11' repeated twice or '1' repeated 4 times
  return Array.from(new Set(allInvalidIds));
}).reduce((sum, id) => sum + id));
