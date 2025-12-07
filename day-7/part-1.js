const width = input.indexOf('\n');
// Set of current beams
let frontier = new Set([input.indexOf('S')]);
const hitSplitters = [];
// We know we just have to iterate once for every row, but eh, this works too
while (frontier.size > 0) {
  // Keeping track of the beams will have on the next row
  const nextFrontier = new Set();
  for (const index of frontier) {
    const nextCell = input[index + width + 1];
    if (nextCell === '.') nextFrontier.add(index + width + 1);
    else if (nextCell === '^') {
      nextFrontier.add(index + width);
      nextFrontier.add(index + width + 2);
      hitSplitters.push(index + width + 1);
    }
    // If we're in the last row, nextCell is undefined, so the nextFrontier will be empty
  }
  frontier = nextFrontier;
}
console.log(hitSplitters.length);
