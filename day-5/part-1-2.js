const [ranges, ids] = input
  .split('\n\n')
  .map((block) => block.split('\n'))
  .map((lines, areIndexes) =>
    lines.map(areIndexes ? Number : (line) => line.split('-').map(Number))
  );

const fresh = ids.filter(id => ranges.some(([start, end]) => start <= id && end >= id));
console.log(fresh.length);

const areOverlapping = ([startA, endA], [startB, endB]) => endA >= startB && startA <= endB || startB >= endA && endB <= startA;
const mergeRanges = ([startA, endA], [startB, endB]) => [Math.min(startA, startB), Math.max(endA, endB)];

const mergedRanges = ranges.slice();
for (let index = 0; index < mergedRanges.length; index++) {
  // This will eventually find the compared range itself; but if it finds a different, overlapping range
  // then the result will be lower than the current index
  const overlapIndex = mergedRanges.findIndex(range => areOverlapping(range, mergedRanges[index]));
  if (overlapIndex < index) {
    mergedRanges[overlapIndex] = mergeRanges(mergedRanges[index], mergedRanges[overlapIndex]);
    mergedRanges.splice(index, 1);
    // We go back checking from the index we just fixed (try with the test data to see why)
    index = overlapIndex;
  }
}
console.log(mergedRanges.reduce((sum, [start, end]) => sum + end - start + 1, 0));
